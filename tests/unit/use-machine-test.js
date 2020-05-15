import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Machine, actions, createMachine } from 'xstate';
import { use } from 'ember-usable';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { useMachine, matchesState } from 'ember-statecharts';

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
        testContext.test.statechart.currentState.value,
        'stopped',
        'statechart state is accessible'
      );

      testContext.test.statechart.send('START');

      assert.equal(
        testContext.test.statechart.currentState.value,
        'started',
        'statechart state updated'
      );

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
        testContext.test.statechart.currentState.value,
        'stopped',
        'statechart state is accessible'
      );

      testContext.test.statechart.send('START');

      assert.equal(
        testContext.test.statechart.currentState.value,
        'started',
        'statechart state updated'
      );

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
        testContext.test.statechart.currentState.value,
        'stopped',
        'statechart state is accessible'
      );

      testContext.test.statechart.send('START');

      assert.equal(
        testContext.test.statechart.currentState.value,
        'started',
        'statechart state updated'
      );

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

    test('interpreted machine service does not get resetup when args change', async function (assert) {
      const testContext = this;

      const { TestMachine, CreatedTestMachine } = this;

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
        }
      }

      this.set('lol', function () {});
      this.set('machine', TestMachine);

      this.owner.register('component:test', Test);

      await render(hbs`
        <Test @lol={{this.lol }} @machine={{this.machine}}/>
      `);

      const service = testContext.test.statechart.service;

      testContext.test.name = 'Zoey';

      assert.deepEqual(
        service,
        testContext.test.statechart.service,
        'service was not resetup after local component state used in @use was changed'
      );

      this.set('lol', function () {});

      assert.deepEqual(service, testContext.test.statechart.service, 'service was not resetup');

      this.set('machine', CreatedTestMachine);

      assert.deepEqual(
        service,
        testContext.test.statechart.service,
        'service was not resetup after component args used in @use were changed'
      );
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
