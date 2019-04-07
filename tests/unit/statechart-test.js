import EmberObject, { get } from '@ember/object';
import { module, test } from 'qunit';
import { statechart } from 'ember-statecharts/computed';

module('Unit | computed | statechart', function() {
  test('it adds statechart functionality to an ember-object', async function(assert) {
    assert.expect(5);

    let subject = EmberObject.extend({
      statechart: statechart(
        {
          initial: 'new',
          states: {
            new: {
              onExit() {
                assert.ok(true, 'exitState was called');
              },
              on: {
                woot: {
                  target: 'foo',
                  actions: ['handleFoo'],
                },
              },
            },
            foo: {
              onEntry(_ctx, { data }) {
                assert.deepEqual(data, testData);
              },
            },
          },
        },
        {
          actions: {
            handleFoo() {
              assert.ok(true, 'event was called');
            },
          },
        }
      ),
    }).create();

    const testData = { wat: 'lol' };

    assert.equal(get(subject, 'statechart.currentState.value'), 'new');

    get(subject, 'statechart').send('woot', testData);

    assert.equal(get(subject, 'statechart.currentState.value'), 'foo');
  });

  test('it is possible to pass statechart-options to the statechart when passing an array of params', async function(assert) {
    assert.expect(5);

    let subject = EmberObject.extend({
      name: 'Tomster',

      power: null,

      statechart: statechart(
        {
          initial: 'powerOff',
          states: {
            powerOff: {
              on: {
                power: {
                  target: 'powerOn',
                  cond: 'enoughPowerIsAvailable',
                },
              },
            },
            powerOn: {},
          },
        },
        {
          guards: {
            enoughPowerIsAvailable: (context, { data }) => {
              assert.equal(context.name, 'Tomster', 'accessing context works');
              let { power } = data;

              return power > 9000;
            },
          },
        }
      ),
    }).create();

    assert.equal(
      get(subject, 'statechart.currentState.value'),
      'powerOff',
      'passing an array as a statechart property works'
    );

    await subject.get('statechart').send('power', { power: 1 });

    assert.equal(
      get(subject, 'statechart.currentState.value'),
      'powerOff',
      'guards will not execute transition when a falsy value is returned'
    );

    await subject.get('statechart').send('power', { power: 9001 });

    assert.equal(
      get(subject, 'statechart.currentState.value'),
      'powerOn',
      'returning a truthy from a guard executes the transition'
    );
  });
});
