import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app-ts/tests/helpers';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | use-machine-ts', function (hooks) {
  setupRenderingTest(hooks);

  test('smoke test', async function (assert) {
    await render(hbs`<UseMachine />`);

    assert
      .dom('[data-test-content]')
      .hasText('Off', 'Initially the state is `off`');

    await click('[data-test-toggle-button]');

    assert
      .dom('[data-test-content]')
      .hasText('On', 'After clicking the toggle the state is `on`');
  });
});
