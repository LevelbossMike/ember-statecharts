import EmberObject, { get } from '@ember/object';
import StatechartMixin from 'ember-statecharts/mixins/statechart';
import { module, test } from 'qunit';

module('Unit | Mixin | statechart', function() {
  test('it adds statechart functionality to an ember-object', async function (assert) {
    assert.expect(5);

    let StatechartObject = EmberObject.extend(StatechartMixin);

    let testData = { wat: 'lol' };

    let subject = StatechartObject.create({
      statechart: {
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
    });

    assert.equal(get(subject, 'states.currentState.value'), 'new');

    await get(subject, 'states').send('woot', testData);

    assert.equal(get(subject, 'states.currentState.value'), 'foo');
  });
});
