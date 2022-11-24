import { assert, module, test } from 'qunit';
import { assign, createMachine } from 'xstate';
import { useMachine } from 'ember-statecharts';
import { tracked } from '@glimmer/tracking';

const toggleMachine = createMachine({
  initial: 'off',
  states: {
    on: {
      on: {
        TOGGLE: 'off',
      },
    },
    off: {
      on: {
        TOGGLE: 'on',
      },
    },
  },
  predictableActionArguments: true,
});

const counterMachine = createMachine({
  context: {
    count: 0,
  },
  initial: 'active',
  states: {
    active: {
      on: {
        INC: {
          actions: assign({
            count: (context) => context.count + 1,
          }),
        },
      },
    },
  },
  predictableActionArguments: true,
});

module('Unit | statechart', function () {
  module('use-machine', function () {
    module('basic usage', function () {
      test('sending events works', async function () {
        class Toggle {
          statechart = useMachine(this, () => {
            return {
              machine: toggleMachine,
            };
          });
        }

        const toggle = new Toggle();

        assert.equal(
          toggle.statechart.state.value,
          'off',
          'initial state is correct'
        );

        toggle.statechart.send('TOGGLE');

        assert.equal(
          toggle.statechart.state.value,
          'on',
          'Toggling state works'
        );
      });

      test('it is possible to work with reactive getters based on statechart context', async function (assert) {
        class OneUpCounter {
          statechart = useMachine(this, () => {
            return {
              machine: counterMachine,
            };
          });

          get count() {
            return this.statechart.state.context.count + 1;
          }

          increment() {
            this.statechart.send('INC');
          }
        }

        const oneUp = new OneUpCounter();

        assert.strictEqual(oneUp.count, 1, 'count starts at 1');

        oneUp.increment();

        assert.strictEqual(oneUp.count, 2, 'getter works as expected');
      });

      test('it is possible to start the statechart in a specific `initialState`', async function () {
        const machine = createMachine({
          initial: 'a',
          states: {
            a: {},
            b: {},
          },
        });

        class Test {
          statechart = useMachine(this, () => {
            return {
              machine,
              initialState: 'b',
            };
          });
        }

        const initialStateTest = new Test();

        assert.strictEqual(
          initialStateTest.statechart.state.value,
          'b',
          'statechart was started in custom initialState'
        );
      });

      test('it is possible to react to state transitions', async function (assert) {
        assert.expect(4);

        class Test {
          statechart = useMachine(this, () => {
            return {
              machine: toggleMachine,
              onTransition(state) {
                assert.step(`onTransition - ${state.value}`);
              },
            };
          });
        }

        const transitionTest = new Test();

        assert.strictEqual(
          transitionTest.statechart.state.value,
          'off',
          'started in correct initialState'
        );

        transitionTest.statechart.send('TOGGLE');

        assert.verifySteps(
          ['onTransition - off', 'onTransition - on'],
          'onTransition was called twice - once for initial transition and then for `TOGGLE`'
        );
      });
    });

    module('handling reactive updates', function () {
      test('`update` will be called', async function (assert) {
        assert.expect(3);

        class ReactiveToggle {
          @tracked disabled;

          statechart = useMachine(this, () => {
            const { disabled } = this;

            return {
              machine: toggleMachine.withContext({
                disabled,
              }),
              update() {
                assert.step('update');
              },
            };
          });
        }

        const toggle = new ReactiveToggle();

        assert.deepEqual(
          toggle.statechart.state.value,
          'off',
          'initial state is correct'
        );

        toggle.disabled = true;

        // consume state so that we handle update - in a regular app the rendering
        // layer will consume the value automatically.
        toggle.statechart.state;

        assert.verifySteps(
          ['update'],
          'update hook was called after consumed args are changed'
        );
      });

      test('`update` can send events to the running interpreter', async function (assert) {
        assert.expect(3);

        const updateSendMachine = createMachine({
          initial: 'off',
          states: {
            off: {
              on: {
                TOGGLE: 'on',
              },
            },
            on: {
              on: {
                TOGGLE: 'off',
                UPDATE: 'updated',
              },
            },
            updated: {},
          },
        });

        class ReactiveToggle {
          @tracked disabled;

          statechart = useMachine(this, () => {
            const { disabled } = this;

            return {
              machine: updateSendMachine.withContext({
                disabled,
              }),
              update({ send }) {
                send('UPDATE');
              },
            };
          });
        }

        const toggle = new ReactiveToggle();

        assert.deepEqual(
          toggle.statechart.state.value,
          'off',
          'initial state is correct'
        );

        toggle.statechart.send('TOGGLE');

        assert.deepEqual(toggle.statechart.state.value, 'on', 'toggle is `on`');

        toggle.disabled = true;

        // consume state so that we handle update - in a regular app the rendering
        // layer will consume the value automatically.
        toggle.statechart.state;

        assert.deepEqual(
          toggle.statechart.state.value,
          'updated',
          'toggle is in `updated`-stated because we send an event in `update`'
        );
      });

      test('not passing `update` does not break', async function (assert) {
        class ReactiveToggle {
          @tracked disabled;

          statechart = useMachine(this, () => {
            const { disabled } = this;

            return {
              machine: toggleMachine.withContext({
                disabled,
              }),
            };
          });
        }

        const toggle = new ReactiveToggle();

        assert.deepEqual(
          toggle.statechart.state.value,
          'off',
          'initial state is correct'
        );

        toggle.statechart.send('TOGGLE');

        assert.deepEqual(toggle.statechart.state.value, 'on', 'toggle is `on`');

        toggle.disabled = true;

        // consume state so that we handle update - in a regular app the rendering
        // layer will consume the value automatically.
        toggle.statechart.state;

        assert.deepEqual(toggle.statechart.state.value, 'on', 'nothing broke');
      });

      module('restart', function () {
        test('`update` can restart the intepreter', async function (assert) {
          class ReactiveToggle {
            @tracked disabled;

            statechart = useMachine(this, () => {
              const { disabled } = this;

              return {
                machine: toggleMachine.withContext({
                  disabled,
                }),
                update({ restart }) {
                  restart();
                },
              };
            });
          }

          const toggle = new ReactiveToggle();

          assert.deepEqual(
            toggle.statechart.state.value,
            'off',
            'initial state is correct'
          );

          toggle.statechart.send('TOGGLE');

          assert.deepEqual(
            toggle.statechart.state.value,
            'on',
            'toggle is `on`'
          );

          toggle.disabled = true;

          // consume state so that we handle update - in a regular app the rendering
          // layer will consume the value automatically.
          toggle.statechart.state;

          assert.deepEqual(
            toggle.statechart.state.value,
            'off',
            'toggle is back in its `initialState` after restart'
          );
        });

        test("`update`'s restart will restart with updated machine config/context", async function (assert) {
          class Counter {
            @tracked count;

            constructor({ count } = { count: 0 }) {
              this.count = count;
            }

            statechart = useMachine(this, () => {
              const { count } = this;

              return {
                machine: counterMachine.withContext({
                  count,
                }),
                update({ restart }) {
                  restart();
                },
              };
            });
          }

          const counter = new Counter();

          assert.strictEqual(
            counter.statechart.state.context.count,
            0,
            'machine was initialized with expected count'
          );

          counter.count = 9001;

          // consume state so that we handle update - in a regular app the rendering
          // layer will consume the value automatically.
          counter.statechart.state;

          assert.strictEqual(
            counter.statechart.state.context.count,
            9001,
            'count is over 9000!!!'
          );
        });

        test("`update`'s restart allows restarting in a specific state", async function (assert) {
          const restartMachine = createMachine({
            initial: 'active',
            states: {
              active: {},
              restarted: {},
            },
          });

          class TestRestart {
            @tracked prop;

            statechart = useMachine(this, () => {
              const { prop } = this;
              return {
                machine: restartMachine.withContext({
                  prop,
                }),
                update({ restart }) {
                  restart('restarted');
                },
              };
            });
          }

          const testRestart = new TestRestart();

          assert.strictEqual(
            testRestart.statechart.state.value,
            'active',
            'initial state is correct'
          );

          testRestart.prop = 'update';

          // consume state so that we handle update - in a regular app the rendering
          // layer will consume the value automatically.
          testRestart.statechart.state;

          assert.strictEqual(
            testRestart.statechart.state.value,
            'restarted',
            'interpreter was restarted in new initialState'
          );
        });

        test("`update`'s restart will respect `initialState` when no initialState is passed to restart", async function (assert) {
          const restartInitialMachine = createMachine({
            initial: 'a',
            states: {
              a: {},
              b: {
                on: {
                  A: 'a',
                },
              },
            },
          });

          class Test {
            @tracked prop;

            statechart = useMachine(this, () => {
              const { prop } = this;
              return {
                machine: restartInitialMachine.withContext({
                  prop,
                }),
                update: ({ restart }) => {
                  restart();
                },
                initialState: 'b',
              };
            });
          }

          const restartTest = new Test();

          assert.strictEqual(
            restartTest.statechart.state.value,
            'b',
            'started in correct `initialState`'
          );

          restartTest.statechart.send('A');

          assert.strictEqual(
            restartTest.statechart.state.value,
            'a',
            'updated state as expected'
          );

          restartTest.prop = 'update';

          // consume state so that we handle update - in a regular app the rendering
          // layer will consume the value automatically.
          restartTest.statechart.state;

          assert.strictEqual(
            restartTest.statechart.state.value,
            'b',
            'started in correct `initialState`'
          );
        });

        test("`update`'s restart will restart in passed initialState, even when initialState was provided ", async function (assert) {
          const restartInitialMachine = createMachine({
            initial: 'a',
            states: {
              a: {},
              b: {
                on: {
                  A: 'a',
                },
              },
              c: {},
            },
          });

          class Test {
            @tracked prop;

            statechart = useMachine(this, () => {
              const { prop } = this;
              return {
                machine: restartInitialMachine.withContext({
                  prop,
                }),
                update: ({ restart }) => {
                  restart('c');
                },
                initialState: 'b',
              };
            });
          }

          const restartTest = new Test();

          assert.strictEqual(
            restartTest.statechart.state.value,
            'b',
            'started in correct `initialState`'
          );

          restartTest.statechart.send('A');

          assert.strictEqual(
            restartTest.statechart.state.value,
            'a',
            'updated state as expected'
          );

          restartTest.prop = 'update';

          // consume state so that we handle update - in a regular app the rendering
          // layer will consume the value automatically.
          restartTest.statechart.state;

          assert.strictEqual(
            restartTest.statechart.state.value,
            'c',
            'restarted in correct, passed `initialState`'
          );
        });
      });
    });
  });
});
