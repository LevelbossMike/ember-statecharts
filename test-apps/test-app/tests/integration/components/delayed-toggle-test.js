import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { click, render, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | use-machine', function (hooks) {
  setupRenderingTest(hooks);

  test('awaiting needs to be explicit with no `runloopClockService`-option set', async function (assert) {
    const config = this.owner.resolveRegistration('config:environment');

    config['ember-statecharts'] = {
      runloopClockService: false,
    };

    await render(hbs`<DelayedToggle data-test-toggle />`);

    assert.dom('[data-test-off]').exists('initially toggle is off');

    await click('[data-test-toggle]');

    await waitUntil(() => {
      return document.querySelector('[data-test-off]');
    });

    assert.dom('[data-test-off]').exists('initially toggle is off');
  });

  test('awaiting happens automatically when `runloopClockService`-option is set', async function (assert) {
    const config = this.owner.resolveRegistration('config:environment');

    config['ember-statecharts'] = {
      runloopClockService: true,
    };

    await render(hbs`<DelayedToggle data-test-toggle />`);

    assert.dom('[data-test-off]').exists('initially toggle is off');

    await click('[data-test-toggle]');

    assert.dom('[data-test-off]').exists('initially toggle is off');
  });
});
