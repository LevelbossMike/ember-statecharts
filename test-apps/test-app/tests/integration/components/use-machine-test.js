import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | use-machine', function (hooks) {
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

  test('self-transitions do not trigger reactive getters', async function (assert) {
    await render(hbs`<UseMachine />`);

    assert
      .dom('[data-test-number-of-changes]')
      .hasText('1', 'Initially only 1 call');

    await click('[data-test-self-button]');

    assert
      .dom('[data-test-number-of-changes]')
      .hasText('1', 'It should still have 1 call');
  });
});
