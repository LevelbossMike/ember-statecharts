import Statechart from 'dummy/utils/statechart';
import { module, test } from 'qunit';

module('Unit | Utility | statechart', function(/*hooks*/) {

  test('it starts with an initial state', function(assert) {
    let result = new Statechart({
      initial: 'new',
      states: {
        new: {}
      }
    });

    assert.equal(result.currentState.value, 'new');
  });

  test('the statechart can send events to its states which will be handled by actions', function(assert) {
    let stateChart = new Statechart({
      initial: 'new',
      states: {
        new: {
          on: {
            woot: {
              next: {
                actions: [
                  () => {
                    assert.ok(true, 'stateChart forwarded event to its currentState which handled it via an action');
                  }
                ]
              }
            }
          }
        },
        next: {}
      }
    });

    stateChart.send('woot');
  });

  test('it is possible to pass data when sending events', function(assert) {
    let data = {
      name: 'Tomster'
    };
    let stateChart = new Statechart({
      initial: 'new',
      states: {
        new: {
          on: {
            woot: {
              next: {
                actions: [
                  (eventData) => {
                    assert.deepEqual(eventData, data, 'passing data works as expected');
                  }
                ]
              }
            }
          }
        },
        next: {}
      }
    });

    stateChart.send('woot', data);
  });

  test('if the currentState does not implement the sent event it does not break', function(assert) {
    let stateChart = new Statechart({
      initial: 'new',
      states: {
        new: {}
      }
    });

    stateChart.send('wat');

    assert.equal(stateChart.currentState.value, 'new');
  });

  test('state event handlers can transition to other states of the stateChart', async function(assert) {
    let stateChart = new Statechart({
      initial: 'new',
      states: {
        new: {
          on: {
            woot: 'next'
          }
        },
        next: {}
      }
    });

    assert.equal(stateChart.currentState, 'new', 'initial state was setup correctly');

    await stateChart.send('woot');

    assert.equal(stateChart.currentState.value, 'next', 'successfully transitioned into the new state');
  });

  test("when a new state is entered the old state's `onExit` function will be called and after that the newState's `onEntry` function`", async function(assert) {
    assert.expect(4);

    let someData = { woot: 'lol' };
    let functionOrder = [];

    let stateChart = new Statechart({
      initial: 'new',
      states: {
        new: {
          on: {
            woot: 'next'
          },
          onExit(data) {
            functionOrder.push('exitState');
            assert.deepEqual(data, someData, 'states can pass data when they transition');
          }
        },
        next: {
          onEntry(data) {
            functionOrder.push('enterState');
            assert.deepEqual(data, someData, 'states can pass data when they transition');
          }
        }
      }
    });

    await stateChart.send('woot', someData);

    assert.equal(stateChart.currentState.value, 'next', 'entered correct state');
    assert.deepEqual(functionOrder, ['exitState', 'enterState'], 'exit and enter functions called in right order');
  });

  test("after a new state has been entered the stateChart's `didChangeState` function is called", async function(assert) {
    let stateChart = new Statechart({
      initial: 'new',
      states: {
        new: {
          on: {
            woot: 'next'
          }
        },
        next: {}
      },
      didChangeState(newState) {
        assert.equal(newState.value, 'next', 'new State passed to `didChangeState`');
      }
    });

    await stateChart.send('woot');
  });

  test('StateCharts can be passed a context that the states have access to in their actions', async function(assert) {
    let testContext = {
      name: 'test context'
    };

    let stateChart = new Statechart({
      context: testContext,
      initial: 'new',
      states: {
        new: {
          on: {
            woot: {
              next: {
                actions: [
                  (data, context) => {
                    assert.deepEqual(context, testContext, 'context is accessible in action handlers');
                  }
                ]
              }
            }
          }
        },
        next: {}
      }
    });

    await stateChart.send('woot');
  });

  test('Statecharts can implement guards to determine if a transition should occur between states', async function(assert) {
    assert.expect(6);

    let testData = {
      name: 'Tomster'
    };

    let testContext = {
      name: 'test context'
    };

    let stateChart = new Statechart({
      initial: 'new',
      context: testContext,
      states: {
        new: {
          on: {
            woot: {
              next: {
                cond: (extendedState, eventObject) => {
                  let { type, data } = eventObject;
                  assert.equal(type, 'woot', 'eventName is accessible in condition');
                  assert.deepEqual(data, testData, 'passed event data is available in condition');
                  assert.deepEqual(extendedState, testContext, "the statechart's context is available in condition");

                  return false;
                },
                actions: [
                  () => assert.ok(false, "no action will be called as we won't transition because of `woot`-event")
                ]
              }
            },
            foo: {
              next: {
                cond: () => {
                  return true;
                },
                actions: [
                  () => assert.ok(true, 'returning `true` from a condition will trigger a transition')
                ]
              }
            }
          }
        },
        next: {}
      }
    });

    await stateChart.send('woot', testData);

    assert.equal(stateChart.currentState.value, 'new', 'woot did not trigger a transition');

    await stateChart.send('foo', testData);

    assert.equal(stateChart.currentState.value, 'next', 'foo did trigger a transition');
  });

  test('StateCharts can be nested', async function(assert) {
    let stateChart = new Statechart({
      initial: 'off',
      states: {
        off: {
          on: {
            power: 'on'
          }
        },
        on: {
          initial: 'stopped',
          states: {
            stopped: {},
            playing: {},
            paused: {}
          }
        }
      }
    });

    assert.equal(stateChart.currentState.value, 'off');

    await stateChart.send('power');

    assert.deepEqual(stateChart.currentState.value, { on: 'stopped' }, 'nested states will return an object as their `value`');
  });

  test('Statechart transitions in nested states work', async function(assert) {
    assert.expect(3);
    let stateChart = new Statechart({
      initial: 'on',
      states: {
        off: {
          on: {
            power: 'on'
          }
        },
        on: {
          initial: 'stopped',
          states: {
            stopped: {
              on: {
                play: 'playing'
              }
            },
            playing: {},
            paused: {}
          },
          on: {
            power: 'off'
          }
        }
      }
    });

    assert.deepEqual(stateChart.currentState.value, { on: 'stopped' });

    await stateChart.send('play');

    assert.deepEqual(stateChart.currentState.value, { on: 'playing' });

    await stateChart.send('power');

    assert.deepEqual(stateChart.currentState.value, 'off');
  });

  test('nested statecharts have access to the top-level context object', async function(assert) {
    assert.expect(8);

    let testContext = {
      name: 'lol'
    };

    let stateChart = new Statechart({
      initial: 'off',
      context: testContext,

      states: {
        off: {
          on: {
            power: 'on'
          }
        },
        on: {
          initial: 'stopped',
          states: {
            stopped: {
              onEntry(data, context) {
                assert.deepEqual(context, testContext, 'context is available as expected');
              },
              onExit(data, context) {
                assert.equal(context.name, 'lol');
              },
              on: {
                play: {
                  playing: {
                    actions: [
                      (data, context) => { assert.deepEqual(context, testContext) }
                    ]
                  }
                }
              }
            },
            playing: {},
            paused: {}
          },
          on: {
            power: {
              off: {
                actions: [
                  (data, context) => { assert.deepEqual(context, testContext) }
                ]
              }
            }
          }
        }
      }
    });

    assert.equal(stateChart.currentState.value, 'off');

    await stateChart.send('power');

    assert.deepEqual(stateChart.currentState.value, { on: 'stopped' });

    await stateChart.send('play');

    assert.deepEqual(stateChart.currentState.value, { on: 'playing' });

    await stateChart.send('power');

    assert.equal(stateChart.currentState.value, 'off');
  });

  test('nested statecharts will execute onEntry handlers for the chart first and then for the initial state of the nested chart', async function(assert) {
    assert.expect(5);

    let testContext = {
      executionOrder: []
    };

    let testData = {
      wat: 'lol'
    };

    let stateChart = new Statechart({
      initial: 'off',
      context: testContext,

      states: {
        off: {
          on: {
            power: 'on'
          }
        },
        on: {
          initial: 'stopped',
          states: {
            stopped: {
              onEntry(data, context) {
                assert.deepEqual(data, testData, 'data passed via send will be available in substates as well');
                context.executionOrder.push('stopped')
              }
            },
            playing: {
              onEntry(data, context) {
                context.executionOrder.push('wat');
              }
            }
          },
          onEntry(data, context) {
            assert.deepEqual(data, testData, 'data passed from goToState wil be available in enterState');
            context.executionOrder.push('on');
          }
        }
      }
    });

    assert.equal(stateChart.currentState.value, 'off');

    await stateChart.send('power', testData);

    assert.deepEqual(stateChart.currentState.value, { on: 'stopped' });
    assert.deepEqual(testContext.executionOrder, ['on', 'stopped']);
  });

  test('nested statecharts will execute exitState handlers for substate first and then for the chart', async function(assert) {
    assert.expect(3);

    let testContext = {
      executionOrder: []
    };

    let stateChart = new Statechart({
      initial: 'on',
      context: testContext,

      states: {
        off: {},
        on: {
          initial: 'stopped',
          states: {
            stopped: {
              onExit(data, context) {
                context.executionOrder.push('stopped')
              }
            },
            playing: {
              onExit(data, context) {
                context.executionOrder.push('wat');
              }
            }
          },
          onExit(data, context) {
            context.executionOrder.push('on');
          },
          on: {
            power: 'off'
          }
        }
      }
    });

    assert.deepEqual(stateChart.currentState.value, { on: 'stopped' });

    await stateChart.send('power');

    assert.equal(stateChart.currentState.value, 'off');
    assert.deepEqual(testContext.executionOrder, ['stopped', 'on']);
  });

  test('when exiting a nested states and entering again we will start out in the default initial state again', async function(assert) {
    let stateChart = new Statechart({
      initial: 'on',
      states: {
        off: {
          on: {
            power: 'on'
          }
        },
        on: {
          initial: 'stopped',
          states: {
            stopped: {
              on: {
                play: 'playing'
              }
            },
            playing: {}
          },
          on: {
            power: 'off'
          }
        }
      }
    });

    assert.deepEqual(stateChart.currentState.value, { on: 'stopped' });

    await stateChart.send('play');

    assert.deepEqual(stateChart.currentState.value, { on: 'playing' });

    await stateChart.send('power');

    assert.equal(stateChart.currentState.value, 'off');

    await stateChart.send('power');

    assert.deepEqual(stateChart.currentState.value, { on: 'stopped' });
  });

  test('statecharts can be nested multiple levels deep', async function(assert) {
    let stateChart = new Statechart({
      initial: 'a',
      states: {
        a: {
          initial: 'aa',
          states: {
            aa: {
              initial: 'aaa',
              states: {
                aaa: {
                  initial: 'aaaa',
                  states: {
                    aaaa: {
                      on: {
                        aaab: 'aaab'
                      }
                    },
                    aaab: {}
                  }
                },
                aab: {}
              },
              on: {
                ab: 'ab'
              }
            },
            ab: {}
          }
        }
      }
    });

    assert.deepEqual(stateChart.currentState.value, {
      a: {
        aa: {
          aaa: 'aaaa'
        }
      }
    });

    await stateChart.send('aaab');

    assert.deepEqual(stateChart.currentState.value, {
      a: {
        aa: {
          aaa: 'aaab'
        }
      }
    });

    await stateChart.send('ab');

    assert.deepEqual(stateChart.currentState.value, {
      a: 'ab'
    });
  });
});
