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

  test('StateCharts can be nested', async function(assert) {
    let stateChart = new StateChart({
      initialState: 'off',
      states: {
        off: {
          events: {
            power() {
              return this.goToState('on');
            }
          }
        },
        on: {
          initialState: 'stopped',
          states: {
            stopped: {},
            playing: {},
            paused: {}
          }
        }
      }
    });

    assert.equal(stateChart.currentState.name, 'off');

    await stateChart.send('power');

    assert.equal(stateChart.currentState.name, 'on.stopped');
  });

  test('StateChart transitions in nested states work', async function(assert) {
    let stateChart = new StateChart({
      initialState: 'on',
      states: {
        off: {
          events: {
            power() {
              return this.goToState('on');
            }
          }
        },
        on: {
          initialState: 'stopped',
          states: {
            stopped: {
              events: {
                play() {
                  return this.goToState('playing');
                }
              }
            },
            playing: {},
            paused: {}
          },
          events: {
            power() {
              return this.goToState('off');
            }
          }
        }
      }
    });

    assert.equal(stateChart.currentState.name, 'on.stopped');

    await stateChart.send('play');

    assert.equal(stateChart.currentState.name, 'on.playing');
  });

  test('nested statecharts can handle events themselves', async function(assert) {
    let stateChart = new StateChart({
      initialState: 'on',
      states: {
        off: {
          events: {
            power() {
              return this.goToState('on');
            }
          }
        },
        on: {
          initialState: 'stopped',
          states: {
            stopped: {},
            playing: {},
            paused: {}
          },
          events: {
            power() {
              return this.goToState('off');
            }
          }
        },
      }
    });

    assert.equal(stateChart.currentState.name, 'on.stopped');

    await stateChart.send('power');

    assert.equal(stateChart.currentState.name, 'off');
  });
  test('nested statecharts have access to the top-level context object', async function(assert) {
    assert.expect(8);

    let testContext = {
      name: 'lol'
    };

    let stateChart = new StateChart({
      initialState: 'off',
      context: testContext,

      states: {
        off: {
          events: {
            power() {
              return this.goToState('on');
            }
          }
        },
        on: {
          initialState: 'stopped',
          states: {
            stopped: {
              enterState() {
                assert.equal(this.context.name, 'lol', 'context is available as expected');
              },
              exitState() {
                assert.equal(this.context.name, 'lol');
              },
              events: {
                play() {
                  assert.equal(this.context.name, 'lol');
                  return this.goToState('playing');
                }
              }
            },
            playing: {},
            paused: {}
          },
          events: {
            power() {
              assert.equal(this.context.name, 'lol');
              return this.goToState('off');
            },
          }
        },
      }
    });

    assert.equal(stateChart.currentState.name, 'off');

    await stateChart.send('power');

    assert.equal(stateChart.currentState.name, 'on.stopped');

    await stateChart.send('play');

    assert.equal(stateChart.currentState.name, 'on.playing');

    await stateChart.send('power');

    assert.equal(stateChart.currentState.name, 'off');
  });

  test('nested statecharts will execute enterState handlers for the chart first and then for the initialState of the nested chart', async function(assert) {
    assert.expect(5);

    let testContext = {
      executionOrder: []
    };

    let testData = {
      wat: 'lol'
    };

    let stateChart = new StateChart({
      initialState: 'off',
      context: testContext,

      states: {
        off: {
          events: {
            power() {
              return this.goToState('on', testData);
            }
          }
        },
        on: {
          initialState: 'stopped',
          states: {
            stopped: {
              enterState(data) {
                assert.deepEqual(data, testData, 'data passed via topLevel goToState will be available in substates as well');
                this.context.executionOrder.push('stopped')
              }
            },
            playing: {
              enterState() {
                this.context.executionOrder.push('wat');
              }
            }
          },
          enterState(data) {
            assert.deepEqual(data, testData, 'data passed from goToState wil be available in enterState');
            this.context.executionOrder.push('on');
          }
        }
      }
    });

    assert.equal(stateChart.currentState.name, 'off');

    await stateChart.send('power');

    assert.equal(stateChart.currentState.name, 'on.stopped');
    assert.deepEqual(testContext.executionOrder, ['on', 'stopped']);
  });

  test('nested statecharts will execute exitState handlers for substate first and then for the chart', async function(assert) {
    assert.expect(3);

    let testContext = {
      executionOrder: []
    };

    let stateChart = new StateChart({
      initialState: 'on',
      context: testContext,

      states: {
        off: {},
        on: {
          initialState: 'stopped',
          states: {
            stopped: {
              exitState() {
                this.context.executionOrder.push('stopped')
              }
            },
            playing: {
              exitState() {
                this.context.executionOrder.push('wat');
              }
            }
          },
          exitState() {
            this.context.executionOrder.push('on');
          },
          events: {
            power() {
              return this.goToState('off');
            }
          }
        }
      }
    });

    assert.equal(stateChart.currentState.name, 'on.stopped');

    await stateChart.send('power');

    assert.equal(stateChart.currentState.name, 'off');
    assert.deepEqual(testContext.executionOrder, ['stopped', 'on']);
  });
});

test('when exiting a nested states and entering again we will start out in the default initial state again', async function(assert) {
  let stateChart = new StateChart({
    initialState: 'on',
    states: {
      off: {
        events: {
          power() {
            return this.goToState('on');
          }
        }
      },
      on: {
        initialState: 'stopped',
        states: {
          stopped: {
            events: {
              play() {
                return this.goToState('playing');
              }
            }
          },
          playing: {}
        },
        events: {
          power() {
            return this.goToState('off');
          }
        }
      }
    }
  });

  assert.equal(stateChart.currentState.name, 'on.stopped');

  await stateChart.send('play');

  assert.equal(stateChart.currentState.name, 'on.playing');

  await stateChart.send('power');

  assert.equal(stateChart.currentState.name, 'off');

  await stateChart.send('power');

  assert.equal(stateChart.currentState.name, 'on.stopped');
});

test('statecharts can be nested multiple levels deep', async function(assert) {
  let stateChart = new StateChart({
    initialState: 'a',
    states: {
      a: {
        initialState: 'aa',
        states: {
          aa: {
            initialState: 'aaa',
            states: {
              aaa: {
                initialState: 'aaaa',
                states: {
                  aaaa: {
                    events: {
                      aaab() {
                        return this.goToState('aaab');
                      }
                    }
                  },
                  aaab: {}
                }
              },
              aab: {}
            },
            events: {
              ab() {
                return this.goToState('ab');
              }
            }
          },
          ab: {}
        }
      }
    }
  });

  assert.equal(stateChart.currentState.name, 'a.aa.aaa.aaaa');

  await stateChart.send('aaab');

  assert.equal(stateChart.currentState.name, 'a.aa.aaa.aaab');

  await stateChart.send('ab');

  assert.equal(stateChart.currentState.name, 'a.ab');
});
