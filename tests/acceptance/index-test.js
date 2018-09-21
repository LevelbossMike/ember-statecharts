import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting the dummy app works as expected', async function(assert) {
    await visit('/');

    assert.dom('[data-test-dummy-app]').exists('dummy application.hbs loads');
  });
});
