import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Machine, actions, createMachine } from 'xstate';
import { use } from 'ember-usable';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { setComponentTemplate } from '@ember/component';

import { useMachine, matchesState } from 'ember-statecharts';
import { ARGS_STATE_CHANGE_WARNING } from 'ember-statecharts/usables/use-machine';

module('Unit | use-machine', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const TestMachineConfig = {
      initial: 'stopped',
      states: {
        stopped: {
          on: {
            START: {
              target: 'started',
              actions: ['lol'],
            },
          },
        },
        started: {
          on: {
            STOP: 'stopped',
          },
        },
      },
    };

    const TestMachine = Machine(TestMachineConfig, {
      actions: {
        lol() {},
      },
    });

    const CreatedTestMachine = createMachine(TestMachineConfig, {
      actions: {
        lol() {},
      },
    });

    this.set('TestMachine', TestMachine);
    this.set('TestMachineConfig', TestMachineConfig);
    this.set('CreatedTestMachine', CreatedTestMachine);
  });

  module('it is possible to work with `useMachine`', function () {
    test('passing a machine created with `Machine` works', async function (assert) {
      const testContext = this;

      const { TestMachine } = this;

      class Test extends Component {
        @use statechart = useMachine(TestMachine)
          .withConfig({
            actions: {
              lol(context) {
                assert.equal(context.name, 'Tomster', 'context was updated as expected');
                assert.step('patched');
              },
            },
          })
          .withContext({
            name: this.name,
          });

        constructor(owner, args) {
          super(owner, args);

          testContext.test = this;

          this.name = 'Tomster';
        }
      }

      this.owner.register('component:test', Test);

      await render(hbs`
        <Test />
      `);

      assert.equal(
        testContext.test.statechart.state.value,
        'stopped',
        'statechart state is accessible'
      );

      testContext.test.statechart.send('START');

      assert.equal(testContext.test.statechart.state.value, 'started', 'statechart state updated');

      assert.verifySteps(['patched'], 'config can be updated via `@use`');
    });

    test('passing a machineConfig works', async function (assert) {
      const testContext = this;

      const { TestMachineConfig } = this;

      class Test extends Component {
        @use statechart = useMachine(TestMachineConfig)
          .withConfig({
            actions: {
              lol(context) {
                assert.equal(context.name, 'Tomster', 'context was updated as expected');
                assert.step('patched');
              },
            },
          })
          .withContext({
            name: this.name,
          });

        constructor(owner, args) {
          super(owner, args);

          testContext.test = this;

          this.name = 'Tomster';
        }
      }

      this.owner.register('component:test', Test);

      await render(hbs`
        <Test />
      `);

      assert.equal(
        testContext.test.statechart.state.value,
        'stopped',
        'statechart state is accessible'
      );

      testContext.test.statechart.send('START');

      assert.equal(testContext.test.statechart.state.value, 'started', 'statechart state updated');

      assert.verifySteps(['patched'], 'config can be updated via `@use`');
    });

    test('passing a machine created via `createMachine` works', async function (assert) {
      const testContext = this;

      const { CreatedTestMachine } = this;

      class Test extends Component {
        @use statechart = useMachine(CreatedTestMachine)
          .withConfig({
            actions: {
              lol(context) {
                assert.equal(context.name, 'Tomster', 'context was updated as expected');
                assert.step('patched');
              },
            },
          })
          .withContext({
            name: this.name,
          });

        constructor(owner, args) {
          super(owner, args);

          testContext.test = this;

          this.name = 'Tomster';
        }
      }

      this.owner.register('component:test', Test);

      await render(hbs`
        <Test />
      `);

      assert.equal(
        testContext.test.statechart.state.value,
        'stopped',
        'statechart state is accessible'
      );

      testContext.test.statechart.send('START');

      assert.equal(testContext.test.statechart.state.value, 'started', 'statechart state updated');

      assert.verifySteps(['patched'], 'config can be updated via `@use`');
    });

    test('passing `interpreterOptions` works', async function (assert) {
      class Test extends Component {
        @use statechart = useMachine(
          Machine({
            initial: 'idle',
            states: {
              idle: {
                entry: actions.log('Custom logger called'),
              },
            },
          }),
          {
            logger: (string) => assert.step(string),
          }
        );

        constructor(owner, args) {
          super(owner, args);

          // access usable to setup usable
          this.statechart;
        }
      }

      this.owner.register('component:test', Test);

      await render(hbs`
        <Test />
      `);

      assert.verifySteps(['Custom logger called'], 'Custom logger was called');
    });

    test('interpreted machine service is stopped when component is torn down', async function (assert) {
      const testContext = this;
      const { TestMachine } = this;

      class Test extends Component {
        @use statechart = useMachine(TestMachine);
        constructor(owner, args) {
          super(owner, args);

          testContext.test = this;
        }
      }

      this.owner.register('component:test', Test);

      await render(hbs`
        <Test />
      `);

      const service = testContext.test.statechart.service;

      service.onStop(function () {
        assert.step('service stopped');
      });

      assert.verifySteps([], 'service was not stopped');

      await clearRender();

      assert.verifySteps(['service stopped'], 'service was stopped');
    });

    module('when args and local state passed to `useMachine` change', function (hooks) {
      hooks.beforeEach(function () {
        const testContext = this;

        class Test extends Component {
          @tracked name;
          @use statechart = useMachine(this.args.machine)
            .withConfig({
              actions: {
                lol: this.args.lol,
              },
            })
            .withContext({
              name: this.name,
            });

          constructor(owner, args) {
            super(owner, args);

            testContext.test = this;

            this.name = 'Tomster';

            // access usable to setup usable
            this.statechart;
          }
        }

        this.owner.register('component:test', Test);
      });

      test('interpreted machine service does not get resetup when args change', async function (assert) {
        const testContext = this;

        const { TestMachine, CreatedTestMachine } = this;

        this.set('lol', function () {});
        this.set('machine', TestMachine);

        await render(hbs`
          <Test @lol={{this.lol}} @machine={{this.machine}}/>
        `);

        const service = testContext.test.statechart.service;

        testContext.test.name = 'Zoey';

        assert.deepEqual(
          service,
          testContext.test.statechart.service,
          'service was not resetup after local component state used in `useMachine#withContext` was changed'
        );

        this.set('lol', function () {});

        assert.deepEqual(
          service,
          testContext.test.statechart.service,
          'service was not resetup after args used in `useMachine#withConfig` were changed'
        );

        this.set('machine', CreatedTestMachine);

        assert.deepEqual(
          service,
          testContext.test.statechart.service,
          'service was not resetup after component args used in @use were changed'
        );
      });

      test('when args or local state passed to `useMachine` is changed a warning is issued', async function (assert) {
        const { TestMachine, CreatedTestMachine } = this;

        this.set('lol', function () {});
        this.set('machine', TestMachine);

        await render(hbs`
          <Test @lol={{this.lol}} @machine={{this.machine}}/>
        `);

        // local state change
        this.set('test.name', 'Zoey');

        assert.expectWarning(
          ARGS_STATE_CHANGE_WARNING,
          'warning was issued based on local state change'
        );

        // args change `withConfig`
        this.set('lol', function () {});

        assert.expectWarning(
          ARGS_STATE_CHANGE_WARNING,
          'warning was issued based on args change used in `withConfig`'
        );

        // args change `useMachine`
        this.set('machine', CreatedTestMachine);

        assert.expectWarning(ARGS_STATE_CHANGE_WARNING, 'warning was issued based on args change');
      });
    });

    module("xstate's built-in assign works as expected", function () {
      hooks.beforeEach(function () {
        this.counterMachine = Machine({
          initial: 'active',
          states: {
            active: {
              on: {
                INCREMENT: {
                  actions: 'increment',
                },
                DECREMENT: {
                  actions: 'decrement',
                },
              },
            },
          },
        });

        this.counterTemplate = hbs`
          <div data-test-count={{this.statechart.state.context.count}}>
            Count: {{this.statechart.state.context.count}}
          </div>
          <button
            type="button"
            data-test-plus
            {{on "click" this.plusClicked}}
          >
            +
          </button>
          <button
            type="button"
            data-test-minus
            {{on "click" this.minusClicked}}
          >
            -
          </button>
        `;
      });

      test('it is possible to use `assign` with an object', async function (assert) {
        const { counterMachine } = this;

        class Counter extends Component {
          @use statechart = useMachine(counterMachine)
            .withContext({
              count: 0,
            })
            .withConfig({
              actions: {
                increment: actions.assign({
                  count: (context) => context.count + 1,
                }),
                decrement: actions.assign({
                  count: (context) => context.count - 1,
                }),
              },
            });

          @action
          plusClicked() {
            this.statechart.send('INCREMENT');
          }

          @action
          minusClicked() {
            this.statechart.send('DECREMENT');
          }
        }

        setComponentTemplate(this.counterTemplate, Counter);

        this.owner.register('component:counter', Counter);

        await render(hbs`
          <Counter />
        `);

        assert.dom('[data-test-count="0"]').exists('count is 0 initially');

        await click('[data-test-plus]');

        assert.dom('[data-test-count="1"]').exists('count was updated - 1');

        await click('[data-test-minus]');

        assert.dom('[data-test-count="0"]').exists('count was updated - 0 again');
      });

      test('it is possible to use `assign` with a function that returns the updated state', async function (assert) {
        const { counterMachine } = this;

        class Counter extends Component {
          @use statechart = useMachine(counterMachine)
            .withContext({
              count: 0,
            })
            .withConfig({
              actions: {
                increment: actions.assign((context) => {
                  return {
                    count: context.count + 1,
                  };
                }),
                decrement: actions.assign((context) => {
                  return {
                    count: context.count - 1,
                  };
                }),
              },
            });

          @action
          plusClicked() {
            this.statechart.send('INCREMENT');
          }

          @action
          minusClicked() {
            this.statechart.send('DECREMENT');
          }
        }

        setComponentTemplate(this.counterTemplate, Counter);

        this.owner.register('component:counter', Counter);

        await render(hbs`
          <Counter />
        `);

        assert.dom('[data-test-count="0"]').exists('count is 0 initially');

        await click('[data-test-plus]');

        assert.dom('[data-test-count="1"]').exists('count was updated - 1');

        await click('[data-test-minus]');

        assert.dom('[data-test-count="0"]').exists('count was updated - 0 again');
      });

      test('reactive getters are possible based on `assign`ed context changes', async function (assert) {
        const { counterMachine } = this;

        class Counter extends Component {
          @use statechart = useMachine(counterMachine)
            .withContext({
              count: 0,
            })
            .withConfig({
              actions: {
                increment: actions.assign({
                  count: (context) => context.count + 1,
                }),
                decrement: actions.assign({
                  count: (context) => context.count - 1,
                }),
              },
            });

          get plusIsDisabled() {
            return this.statechart.state.context.count > 0;
          }

          @action
          plusClicked() {
            this.statechart.send('INCREMENT');
          }

          @action
          minusClicked() {
            this.statechart.send('DECREMENT');
          }
        }

        setComponentTemplate(
          hbs`
          <div>{{this.statechart.state.context.count}}</div>

          <button
            type="button"
            disabled={{this.plusIsDisabled}}
            data-test-plus
            {{on "click" this.plusClicked}}
          >
            +
          </button>
          <button
            type="button"
            data-test-minus
            {{on "click" this.minusClicked}}
          >
            -
          </button>
        `,
          Counter
        );

        this.owner.register('component:counter', Counter);

        await render(hbs`
          <Counter />
        `);

        assert.dom('[data-test-plus]').isNotDisabled('plus button is not disabled - count is 0');

        await click('[data-test-plus]');

        assert
          .dom('[data-test-plus]')
          .isDisabled('plus button disabled updated - count is above 0');
      });
    });
  });

  test('`useMachine` works with `matchesState`', async function (assert) {
    const testContext = this;
    const { TestMachine } = this;

    class Test extends Component {
      @use statechart = useMachine(TestMachine);

      @matchesState('stopped')
      isStopped;

      constructor(owner, args) {
        super(owner, args);

        testContext.test = this;

        this.name = 'Tomster';
      }
    }

    this.owner.register('component:test', Test);

    await render(hbs`
      <Test />
    `);

    assert.equal(testContext.test.isStopped, true, 'matchesState works against initial state');

    testContext.test.statechart.send('START');

    assert.equal(
      testContext.test.isStopped,
      false,
      'matchesState updates correctly when state updates'
    );
  });
});
