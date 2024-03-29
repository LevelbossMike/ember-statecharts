import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Promise, resolve, reject } from 'rsvp';

module('Integration | Component | quickstart-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a button', async function (assert) {
    await render(hbs`<QuickstartButton />`);

    assert.dom('button').exists('button is rendered');
  });

  test('it is possible to use the button in block-format', async function (assert) {
    let TEXT = 'Hello';

    this.set('text', TEXT);

    await render(hbs`
    <QuickstartButton data-test-button>
      {{this.text}} World!
    </QuickstartButton>
  `);

    assert.dom('[data-test-button]').hasText('Hello World!');
  });

  test("it's possible to pass an onClick-action handler to the button", async function (assert) {
    assert.expect(1);

    this.set('wat', function () {
      assert.ok(true, 'action handler was called');
    });

    await render(hbs`
      <QuickstartButton
        data-test-button
        @onClick={{this.wat}}
      />
    `);

    await click('[data-test-button]');
  });

  test("when the action triggered by the button clicked gets fired and takes time it's not possible to trigger it again", async function (assert) {
    assert.expect(3);

    this.set('onClick', function () {
      assert.ok(true, 'onClick was triggered');
      return new Promise(function () {});
    });

    await render(hbs`
      <QuickstartButton @text="click me" @onClick={{this.onClick}} data-test-button />
    `);

    click('[data-test-button]');

    await waitFor('[data-test-loading]');

    assert
      .dom('[data-test-loading]')
      .exists('button is displayed with loading ui while busy');

    this.set('onClick', function () {
      assert.ok(false, 'onClick should not be triggered again');
    });

    assert.dom('[data-test-button]').isDisabled('button is disabled when busy');
  });

  test("when passing the disabled property the button is disabled and won't trigger its action", async function (assert) {
    assert.expect(1);

    this.set('onClick', function () {
      assert.ok(false, 'onClick should not be triggered');
    });

    await render(hbs`
      <QuickstartButton
        @text="click me"
        @disabled={{true}}
        @onClick={{this.onClick}}
        data-test-button
      />
    `);

    assert.dom('[data-test-button]').isDisabled('button is disabled');
  });

  test('when the triggered action resolves the `onSuccess` handler is triggered', async function (assert) {
    assert.expect(1);

    this.set('onClick', function () {
      return resolve();
    });

    this.set('onSuccess', function () {
      assert.ok(true, '`onSuccess` was triggered');
    });

    await render(hbs`
      <QuickstartButton
        @text="click me"
        @onClick={{this.onClick}}
        @onSuccess={{this.onSuccess}}
        data-test-button
      />
  `);

    await click('[data-test-button]');
  });

  test('when the triggered action rejects the `onError` handler is triggered', async function (assert) {
    assert.expect(1);

    this.set('onClick', function () {
      return reject();
    });

    this.set('onError', function () {
      assert.ok(true, '`onError` was triggered');
    });

    await render(hbs`
      <QuickstartButton
        @text="click me"
        @onClick={{this.onClick}}
        @onError={{this.onError}}
        data-test-button
      />
    `);

    await click('[data-test-button]');
  });
});
