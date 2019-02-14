import Statechart from 'dummy/utils/statechart';
import { module, test } from 'qunit';
import { Promise } from 'rsvp';

module('Unit | Utility | statechart', function(/*hooks*/) {

  module('#start', function() {
    test('it has a currentState after starting', function(assert) {
      let result = new Statechart({
        initial: 'new',
        states: {
          new: {}
        }
      });

      result.start();

      assert.equal(result.currentState.value, 'new');
    });

    test('when the initial state has an `onEntry` property the provided actions will be executed on start', async function(assert) {
      let result = new Statechart({
        initial: 'new',
        states: {
          new: {
            onEntry() {
              assert.step('onEntry');
            }
          }
        }
      });

      await result.start();

      assert.equal(result.currentState.value, 'new');

      assert.verifySteps(['onEntry'], 'onEntry action was run');
    });

    test('specifying onEntry action on an initial state via a string works', async function(assert) {
      let result = new Statechart({
        initial: 'new',
        states: {
          new: {
            onEntry: 'checkCond',
          }
        }
      }, {
        actions: {
          checkCond() {
            assert.step('onEntry');
          }
        }
      });

      await result.start();

      assert.equal(result.currentState.value, 'new');

      assert.verifySteps(['onEntry']);
    });

    test('specifying onEntry actions on an initial state via a string array works', async function(assert) {
      let result = new Statechart({
        initial: 'new',
        states: {
          new: {
            onEntry: ['checkA', 'checkB'],
          }
        }
      }, {
        actions: {
          checkA() {
            assert.step('checkA');
          },
          checkB() {
            assert.step('checkB');
          }
        }
      });

      await result.start();

      assert.equal(result.currentState.value, 'new');

      assert.verifySteps(['checkA', 'checkB'], 'onEntry functions are executed in the correct order');
    });

    test('specifying onEntry actions via a mixed array of strings and functions will execute both versions of functions', async function(assert) {
      let result = new Statechart({
        initial: 'new',
        states: {
          new: {
            onEntry: [() => { assert.step('inlineCheck'); }, 'checkCond']
          }
        }
      }, {
        actions: {
          checkCond() {
            assert.step('checkCond');
          }
        }
      });

      await result.start();

      assert.equal(result.currentState.value, 'new');

      assert.verifySteps(['inlineCheck', 'checkCond']);
    });
  });

  module('#send', function() {
    test('state event handlers can transition to other states of the statechart when calling `send`', async function(assert) {
      let statechart = new Statechart({
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

      await statechart.start();

      assert.equal(statechart.currentState.value, 'new', 'initial state was setup correctly');

      await statechart.send('woot');

      assert.equal(statechart.currentState.value, 'next', 'successfully transitioned into the new state');
    });

    test('transition to different states can be handled by actions', async function(assert) {
      let statechart = new Statechart({
        initial: 'new',
        states: {
          new: {
            on: {
              woot: {
                target: 'next',
                actions: [
                  () => { assert.step('inlineAction'); },
                  'wat'
                ]
              }
            }
          },
          next: {}
        }
      }, {
        actions: {
          wat() {
            assert.step('wat');
          }
        }
      });

      await statechart.start();

      await statechart.send('woot');

      assert.verifySteps(['inlineAction', 'wat'], 'functions as actions will not be ignored');
    });

    test('it is possible to pass data when sending events', async function(assert) {
      const testData = {
        name: 'Tomster'
      };

      let statechart = new Statechart({
        initial: 'new',
        states: {
          new: {
            on: {
              woot: {
                target: 'next',
                actions: [
                  'wat'
                ]
              }
            }
          },
          next: {}
        }
      }, {
        actions: {
          wat(data) {
            assert.deepEqual(data, testData, 'data was passed as expected');
          }
        }
      });

      await statechart.start();

      await statechart.send('woot', testData);
    });

    test('transition to different states can be handled by multiple actions in sequence', async function(assert) {
      let statechart = new Statechart({
        initial: 'new',
        states: {
          new: {
            on: {
              woot: {
                target: 'next',
                actions: [
                  'wat',
                  'yo'
                ]
              }
            }
          },
          next: {}
        }
      }, {
        actions: {
          wat() {
            assert.step('actionA');
          },
          yo() {
            assert.step('actionB')
          }
        }
      });

      await statechart.start();

      await statechart.send('woot');

      assert.verifySteps(['actionA', 'actionB'], 'actions fire in the correct order');
    });

    test('when specifying multiple actions all actions will be passed the event data', async function(assert) {
      const testData = {
        name: 'Tomster'
      };

      let statechart = new Statechart({
        initial: 'new',
        states: {
          new: {
            on: {
              woot: {
                target: 'next',
                actions: [
                  'wat',
                  'yo'
                ]
              }
            }
          },
          next: {}
        }
      }, {
        actions: {
          wat(data) {
            assert.deepEqual(data, testData, 'actionA got passed correct data');
            assert.step('actionA');
          },
          yo(data) {
            assert.deepEqual(data, testData, 'actionA got passed correct data');
            assert.step('actionB')
          }
        }
      });

      await statechart.start();

      await statechart.send('woot', testData);

      assert.verifySteps(['actionA', 'actionB'], 'actions fire in the correct order');
    });


    test('if the currentState does not implement the sent event it does not break', async function(assert) {
      let statechart = new Statechart({
        initial: 'new',
        states: {
          new: {}
        }
      });

      await statechart.start();
      await statechart.send('wat');

      assert.equal(statechart.currentState.value, 'new');
    });

    test("when a new state is entered the old state's `onExit` function will be called and after that the newState's `onEntry` function`", async function(assert) {
      let someData = { woot: 'lol' };

      let statechart = new Statechart({
        initial: 'new',
        states: {
          new: {
            on: {
              woot: 'next'
            },
            onExit(data) {
              assert.step('exitState');
              assert.deepEqual(data, someData, 'states can pass data when they transition');
            }
          },
          next: {
            onEntry(data) {
              assert.step('enterState');
              assert.deepEqual(data, someData, 'states can pass data when they transition');
            }
          }
        }
      });

      await statechart.start();

      await statechart.send('woot', someData);

      assert.equal(statechart.currentState.value, 'next', 'entered correct state');
      assert.verifySteps(['exitState', 'enterState'], 'exit and enter functions called in right order');
    });

    test("after a new state has been entered the statechart's `didChangeState` function is called", async function(assert) {
      let statechart = new Statechart({
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

      await statechart.start();

      await statechart.send('woot');
    });

    test('StateCharts can be passed a context that the states have access to in their actions', async function(assert) {
      let testContext = {
        name: 'test context'
      };

      let statechart = new Statechart({
        context: testContext,
        initial: 'new',
        states: {
          new: {
            on: {
              woot: {
                target: 'next',
                actions: ['test'],
              }
            }
          },
          next: {}
        }
      }, {
        actions: {
          test(_data, context) {
            assert.deepEqual(context, testContext, 'context is accessible in action handlers');
          }
        }
      });

      await statechart.start();

      await statechart.send('woot');
    });

    test('when providing action names in the actions array they are executed on the passed context', async function(assert) {
      assert.expect(3);

      let testContext = {
        woot(data, context) {
          assert.deepEqual(data, testData, 'action executed with data passed');
          assert.deepEqual(context, testContext, 'action executed with data passed');
          assert.deepEqual(this, testContext, 'string actions executed on the context have the context set as `this`');
        }
      };

      let testData = {
        name: 'Tomster'
      };

      let statechart = new Statechart({
        context: testContext,
        initial: 'new',
        states: {
          new: {
            on: {
              woot: {
                target: 'next',
                actions: ['woot']
              }
            }
          },
          next: {}
        }
      }, {
        actions: {
          woot: testContext.woot
        }
      });

      await statechart.start();

      await statechart.send('woot', testData);
    });

    test('Statecharts can implement guards to determine if a transition should occur between states', async function(assert) {
      assert.expect(6);

      let testData = {
        name: 'Tomster'
      };

      let testContext = {
        name: 'test context'
      };

      let statechart = new Statechart({
        initial: 'new',
        context: testContext,
        states: {
          new: {
            on: {
              woot: {
                target: 'next',
                cond: (extendedState, eventObject) => {
                  let { type, data } = eventObject;
                  assert.equal(type, 'woot', 'eventName is accessible in condition');
                  assert.deepEqual(data, testData, 'passed event data is available in condition');
                  assert.deepEqual(extendedState, testContext, "the statechart's context is available in condition");

                  return false;
                },
                actions: ['wootAction']
              },
              foo: {
                target: 'next',
                cond: () => {
                  return true
                },
                actions: [
                  'fooAction'
                ]
              }
            }
          },
          next: {}
        }
      }, {
        actions: {
          wootAction() {
            assert.ok(false, "no action will be called as we won't transition because of `woot`-event")
          },
          fooAction() {
            assert.ok(true, 'returning `true` from a condition will trigger a transition')
          }
        }
      });

      await statechart.start();
      await statechart.send('woot', testData);

      assert.equal(statechart.currentState.value, 'new', 'woot did not trigger a transition');

      await statechart.send('foo', testData);

      assert.equal(statechart.currentState.value, 'next', 'foo did trigger a transition');
    });

    test('guards can be used to conditionally transition into different states based on the same event', async function(assert) {
      const testContext = {
        power: 1
      };

      const statechart = new Statechart({
        context: testContext,
        initial: 'fighting',
        states: {
          fighting: {
            on: {
              strike: [
                {
                  target: 'won',
                  cond(extendedState) {
                    return extendedState.power > 9000;
                  }
                },
                {
                  target: 'fighting',
                },
              ]
            }
          },
          won: {}
        }
      });

      await statechart.start();

      await statechart.send('strike');

      assert.equal(statechart.currentState.value, 'fighting', 'transition did not happen because of condition');

      testContext.power = 9001;

      await statechart.send('strike');

      assert.equal(statechart.currentState.value, 'won', 'transition did happen because power is now over 9000');
    });

    test('it supports strings as guard conditions', async function(assert) {
      let testContext = {
        name: 'Tomster'
      };

      let testData = {
        canTransition: true
      };

      let statechart = new Statechart({
        context: testContext,
        initial: 'powerOff',
        states: {
          powerOff: {
            on: {
              power: {
                target: 'powerOn',
                cond: 'canTransition'
              }
            }
          },
          powerOn: {}
        }
      }, {
        guards: {
          canTransition: (extendedState, eventObject) => {
            assert.equal(extendedState.name, 'Tomster', 'machine guard functions can access the statecharts context');

            let { type, data: eventData } = eventObject;

            assert.equal(type, 'power', 'eventObject contains name of event that was sent');
            assert.deepEqual(eventData, testData, 'data passed to event is available in guards');

            return eventData.canTransition;
          }
        }
      });

      await statechart.start();

      assert.equal(statechart.currentState.value, 'powerOff');

      await statechart.send('power', testData);

      assert.equal(statechart.currentState.value, 'powerOn');
    });

    test('when `start` takes some time and we send an event the event gets enqueued', async function(assert) {
      const done = assert.async();
      let _resolve;
      let promise = new Promise((resolve) => {
        _resolve = resolve;
      })

      const statechart = new Statechart({
        initial: 'asyncInitial',
        states: {
          asyncInitial: {
            onEntry() {
              return promise;
            },

            on: {
              power: 'powerOn'
            }
          },
          powerOn: {
            onEntry: ['assertAllOk']
          }
        }
      }, {
        actions: {
          assertAllOk() {
            assert.ok(true, 'power got send after statechart initialized');
            done();
          }
        }
      });

      statechart.start();

      statechart.send('power');

      _resolve();
    });
  });


  module('nesting', function() {
    test('StateCharts can be nested', async function(assert) {
      let statechart = new Statechart({
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

      await statechart.start();

      assert.equal(statechart.currentState.value, 'off');

      await statechart.send('power');

      assert.deepEqual(statechart.currentState.value, { on: 'stopped' }, 'nested states will return an object as their `value`');
    });

    test('Statechart transitions in nested states work', async function(assert) {
      assert.expect(3);

      let statechart = new Statechart({
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

      await statechart.start();

      assert.deepEqual(statechart.currentState.value, { on: 'stopped' });

      await statechart.send('play');

      assert.deepEqual(statechart.currentState.value, { on: 'playing' });

      await statechart.send('power');

      assert.deepEqual(statechart.currentState.value, 'off');
    });
    test('nested statecharts have access to the top-level context object', async function(assert) {
      assert.expect(8);

      let testContext = {
        name: 'lol'
      };

      let statechart = new Statechart({
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
                    target: 'playing',
                    actions: ['testTestContext']
                  }
                }
              },
              playing: {},
              paused: {}
            },
            on: {
              power: {
                target: 'off',
                actions: ['testTestContext']
              }
            }
          }
        }
      }, {
        actions: {
          testTestContext(data, context) {
            assert.deepEqual(context, testContext);
          }
        }
      });

      await statechart.start();

      assert.equal(statechart.currentState.value, 'off');

      await statechart.send('power');

      assert.deepEqual(statechart.currentState.value, { on: 'stopped' });

      await statechart.send('play');

      assert.deepEqual(statechart.currentState.value, { on: 'playing' });

      await statechart.send('power');

      assert.equal(statechart.currentState.value, 'off');
    });

    test('nested statecharts will execute onEntry handlers for the chart first and then for the initial state of the nested chart', async function(assert) {
      let testData = {
        wat: 'lol'
      };

      let statechart = new Statechart({
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
              stopped: {
                onEntry(data) {
                  assert.deepEqual(data, testData, 'data passed via send will be available in substates as well');
                  assert.step('stopped');
                }
              },
              playing: {
                onEntry() {
                  assert.step('wat');
                }
              }
            },
            onEntry(data) {
              assert.deepEqual(data, testData, 'data passed from goToState wil be available in enterState');
              assert.step('on');
            }
          }
        }
      });

      await statechart.start();

      assert.equal(statechart.currentState.value, 'off');

      await statechart.send('power', testData);

      assert.deepEqual(statechart.currentState.value, { on: 'stopped' });
      assert.verifySteps(['on', 'stopped']);
    });

    test('nested statecharts will execute exitState handlers for substate first and then for the chart', async function(assert) {
      let statechart = new Statechart({
        initial: 'on',

        states: {
          off: {},
          on: {
            initial: 'stopped',
            states: {
              stopped: {
                onExit() {
                  assert.step('stopped');
                }
              },
              playing: {
                onExit() {
                  assert.step('wat');
                }
              }
            },
            onExit() {
              assert.step('on')
            },
            on: {
              power: 'off'
            }
          }
        }
      });

      await statechart.start();
      assert.deepEqual(statechart.currentState.value, { on: 'stopped' });

      await statechart.send('power');

      assert.equal(statechart.currentState.value, 'off');
      assert.verifySteps(['stopped', 'on']);
    });

    test('when exiting a nested states and entering again we will start out in the default initial state again', async function(assert) {

      let statechart = new Statechart({
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

      await statechart.start();

      assert.deepEqual(statechart.currentState.value, { on: 'stopped' });

      await statechart.send('play');

      assert.deepEqual(statechart.currentState.value, { on: 'playing' });

      await statechart.send('power');

      assert.equal(statechart.currentState.value, 'off');

      await statechart.send('power');

      assert.deepEqual(statechart.currentState.value, { on: 'stopped' });
    });

    test('statecharts can be nested multiple levels deep', async function(assert) {
      let statechart = new Statechart({
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

      await statechart.start();

      assert.deepEqual(statechart.currentState.value, {
        a: {
          aa: {
            aaa: 'aaaa'
          }
        }
      });

      await statechart.send('aaab');

      assert.deepEqual(statechart.currentState.value, {
        a: {
          aa: {
            aaa: 'aaab'
          }
        }
      });

      await statechart.send('ab');

      assert.deepEqual(statechart.currentState.value, {
        a: 'ab'
      });
    });

    test('statecharts can have orthogonal states', async function(assert) {
      assert.expect(10);

      let testContext = {
        name: 'wat',
      };

      let testData = {
        message: 'success!'
      };

      let statechart = new Statechart({
        context: testContext,
        type: 'parallel',
        states: {
          upload: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  INIT_UPLOAD: 'pending'
                }
              },
              pending: {
                on: {
                  UPLOAD_COMPLETE: {
                    target: 'success',
                    actions: ['handleUploadSuccess']
                  }
                }
              },
              success: {}
            }
          },
          download: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  INIT_DOWNLOAD: {
                    target: 'pending',
                    actions: ['handleInitDownload']
                  }
                }
              },
              pending: {
                onEntry(data, context) {
                  assert.deepEqual(data, testData, 'passing data works');
                  assert.deepEqual(context, testContext, 'context is passed as expected');
                },
                on: {
                  DOWNLOAD_COMPLETE: 'success'
                }
              },
              success: {}
            }
          }
        }
      }, {
        actions: {
          handleUploadSuccess(data, context) {
            assert.deepEqual(data, testData, 'passing data works');
            assert.deepEqual(context, testContext, 'context is passed as expected');
          },
          handleInitDownload(data, context) {
            assert.deepEqual(data, testData, 'passing data works');
            assert.deepEqual(context, testContext, 'context is passed');
          }
        }
      });

      await statechart.start();

      assert.deepEqual(statechart.currentState.value, {
        upload: 'idle',
        download: 'idle'
      }, 'parallel/orthogonal states work as expected');

      await statechart.send('INIT_UPLOAD');

      assert.deepEqual(statechart.currentState.value, {
        upload: 'pending',
        download: 'idle'
      }, 'parallel states can handle events');

      await statechart.send('INIT_DOWNLOAD', testData);

      assert.deepEqual(statechart.currentState.value, {
        upload: 'pending',
        download: 'pending'
      }, 'second parallel state can handle events');

      await statechart.send('UPLOAD_COMPLETE', testData);

      assert.deepEqual(statechart.currentState.value, {
        upload: 'success',
        download: 'pending'
      }, 'parallel states have expected end states');
    });
  });
});
