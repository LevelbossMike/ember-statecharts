import StateChart from 'dummy/utils/statechart';
import { module, test } from 'qunit';

module('Unit | Utility | statechart', function(/*hooks*/) {

  test('it starts with an initial state', function(assert) {
    let result = new StateChart({
      initialState: 'new',
      states: {
        new: {}
      }
    });

    assert.equal(result.currentState.name, 'new');
  });

  test('the statechart can send events to its states', function(assert) {
    let stateChart = new StateChart({
      initialState: 'new',
      states: {
        new: {
          events: {
            woot() {
              assert.ok(true, 'stateChart forwarded event to its currentState');
            }
          }
        }
      }
    });

    stateChart.send('woot');
  });

  test('if the currentState does not implement the sent event it does not break', function(assert) {
    let stateChart = new StateChart({
      initialState: 'new',
      states: {
        new: {}
      }
    });

    stateChart.send('wat');

    assert.equal(stateChart.currentState.name, 'new');
  });

  test('state event handlers can transition to other states of the stateChart', async function(assert) {
    let stateChart = new StateChart({
      initialState: 'new',
      states: {
        new: {
          events: {
            woot() {
              return this.goToState('foo');
            }
          }
        },
        foo: {}
      }
    });

    assert.equal(stateChart.currentState.name, 'new', 'initial state was setup correctly');

    await stateChart.send('woot');

    assert.equal(stateChart.currentState.name, 'foo', 'successfully transitioned into the new state');
  });

  test('state event handlers can be passed data', async function(assert) {
    let eventData = {
      woot: 'works'
    };

    let stateChart = new StateChart({
      initialState: 'new',
      states: {
        new: {
          events: {
            woot(data) {
              assert.deepEqual(data, eventData, 'correct data passed to eventHandler');
            }
          }
        }
      }
    });

    stateChart.send('woot', eventData);
  });

  test("when a new state is entered the old state's `exitState` function will be called and after that the newState's `enterState` function`", async function(assert) {
    assert.expect(4);

    let someData = { woot: 'lol' };
    let functionOrder = [];

    let stateChart = new StateChart({
      initialState: 'new',
      states: {
        new: {
          exitState() {
            functionOrder.push('exitState');
            assert.equal(this.name, 'new',  'exitState was called');
          },
          events: {
            woot() {
              return this.goToState('foo', someData);
            }
          }
        },
        foo: {
          enterState(data) {
            functionOrder.push('enterState');
            assert.deepEqual(data, someData, 'states can pass data when the transition');
          }
        }
      }
    });

    await stateChart.send('woot')

    assert.equal(stateChart.currentState.name, 'foo', 'entered correct state');
    assert.deepEqual(functionOrder, ['exitState', 'enterState'], 'exit and enter functions called in right order');
  });

  test("after a new state has been entered the stateChart's `didChangeState` function is called", async function(assert) {
    let stateChart = new StateChart({
      initialState: 'new',
      states: {
        new: {
          events: {
            woot() {
              return this.goToState('foo');
            }
          }
        },
        foo: {}
      },
      didChangeState(newState) {
        assert.equal(newState.name, 'foo', 'new State passed to `didChangeState`');
      }
    });

    await stateChart.send('woot');
  });

  test('StateCharts can be passed a context that the states have access to in their event-handlers', async function(assert) {
    let testContext = {
      name: 'test context'
    };

    let stateChart = new StateChart({
      context: testContext,
      initialState: 'new',
      states: {
        new: {
          events: {
            woot() {
              assert.deepEqual(this.context, testContext, 'context is accessible in event handlers');
            }
          }
        }
      }
    });

    await stateChart.send('woot');
  });
});
