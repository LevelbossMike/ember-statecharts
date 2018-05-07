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
        initialState: 'new',
        states: {
          new: {
            exitState() {
              assert.ok(true, 'exitState was called');
            },
            events: {
              woot() {
                assert.ok(true, 'event was called');
                return this.goToState('foo', testData);
              }
            }
          },
          foo: {
            enterState(data) {
              assert.deepEqual(data, testData);
            }
          }
        }
      }
    });

    assert.equal(get(subject, 'states.currentState.name'), 'new');

    await get(subject, 'states').send('woot');

    assert.equal(get(subject, 'states.currentState.name'), 'foo');
  });
});
