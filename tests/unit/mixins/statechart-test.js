import EmberObject, { get, computed } from '@ember/object';
import StatechartMixin from 'ember-statecharts/mixins/statechart';
import { module, test } from 'qunit';

module('Unit | Mixin | statechart', function() {
  test('it adds statechart functionality to an ember-object', async function (assert) {
    assert.expect(5);

    let testData = { wat: 'lol' };

    let subject = EmberObject.extend(StatechartMixin, {
      statechart: computed(function() {
        return {
          initial: 'new',
          states: {
            new: {
              onExit() {
                assert.ok(true, 'exitState was called');
              },
              on: {
                woot: {
                  foo: {
                    actions: [
                      () => {
                        assert.ok(true, 'event was called');
                      }
                    ]
                  }
                }
              }
            },
            foo: {
              onEntry(data) {
                assert.deepEqual(data, testData);
              }
            }
          }
        }
      })
    }).create();

    assert.equal(get(subject, 'states.currentState.value'), 'new');

    await get(subject, 'states').send('woot', testData);

    assert.equal(get(subject, 'states.currentState.value'), 'foo');
  });

  test('it is possible to pass statechart-options to the statechart when passing an array of params', async function(assert) {
    assert.expect(5);
    let subject = EmberObject.extend(StatechartMixin, {
      name: 'Tomster',

      power: null,

      statechart: computed(function() {
        return [
          {
            initial: 'powerOff',
            states: {
              powerOff: {
                on: {
                  power: {
                    powerOn: {
                      cond: 'enoughPowerIsAvailable'
                    }
                  }
                }
              },
              powerOn: {}
            }
          },
          {
            guards: {
              enoughPowerIsAvailable: (context, { data  }) => {
                assert.equal(context.name, 'Tomster', 'accessing context works');
                let { power } = data;

                return power > 9000;
              }
            }
          }
        ];
      })
    }).create();

    assert.equal(get(subject, 'currentState.value'), 'powerOff', 'passing an array as a statechart property works');

    await subject.get('states').send('power', { power: 1 });

    assert.equal(get(subject, 'currentState.value'), 'powerOff', 'guards will not execute transition when a falsy value is returned');

    await subject.get('states').send('power', { power: 9001 });

    assert.equal(get(subject, 'currentState.value'), 'powerOn', 'returning a truthy from a guard executes the transition');
  });
});
