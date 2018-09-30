import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Promise, resolve, reject } from 'rsvp';

module('Integration | Component | x-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a button', async function(assert) {
    await render(hbs`{{x-button}}`);

    assert.equal(this.element.querySelector('button').tagName, 'BUTTON');
  });

  test("it displays the passed text on the button", async function(assert) {
    let TEXT = 'Hello';

    this.set('text', TEXT);

    await render(hbs`{{x-button data-test-button=true text=text}}`);

    assert.dom('[data-test-button]').hasText(TEXT, 'button displays passed text');
  });

  test("it is possible to use the button in block-format", async function(assert) {
    let TEXT = "Hello"

    this.set('text', TEXT);

    await render(hbs`
      {{#x-button data-test-button=true as |ui|}}
        {{text}} World!
      {{/x-button}}
    `);

    assert.dom('[data-test-button').hasText('Hello World!');
  });

  test("it's possible to pass an onClick-action handler to the button", async function(assert) {
    this.set('wat', function() {
      assert.ok(true, 'action handler was called');
    });

    await render(hbs`{{x-button onClick=(action wat)}}`);

    await click(this.element.querySelector('button'));
  });

  test("when the action triggered by the button clicked gets fired and takes time it's not possible to trigger it again", async function(assert) {
    this.set('onClick', function() {
      assert.ok(true, 'onClick was triggered');
      return new Promise(function() {});
    });

    await render(hbs`{{x-button data-test-button=true text="click me" onClick=(action onClick)}}`);

    click('[data-test-button]');

    await waitFor('[data-test-loading]');

    assert.dom('[data-test-loading').exists('button is displayed with loading ui while busy');

    this.set('onClick', function() {
      assert.ok(false, 'onClick should not be triggered again');
    });

    await click('[data-test-button]');

    assert.dom('[data-test-button]').hasAttribute('disabled');
  });

  test("when passing the disabled property the button is disabled and won't trigger its action", async function(assert) {
    this.set('onClick', function() {
      assert.ok(false, 'onClick should not be triggered');
    });

    await render(hbs`
      {{x-button
        data-test-button=true
        disabled=true
        text="click me"
        onClick=(action onClick)
      }}
    `);

    await click('[data-test-button]');

    assert.dom('[data-test-button]').hasAttribute('disabled');
  });

  test('when the triggered action resolves the `onSuccess` handler is triggered', async function(assert) {
    this.set('onClick', function() {
      return resolve();
    });

    this.set('onSuccess', function() {
      assert.ok(true, '`onSuccess` was triggered');
    });

    await render(hbs`
      {{x-button
        data-test-button=true
        text="click me"
        onClick=(action onClick)
        onSuccess=(action onSuccess)
      }}
    `)

    await click('[data-test-button]');
  });

  test('when the triggered action rejects the `onError` handler is triggered', async function(assert) {
    this.set('onClick', function() {
      return reject();
    });

    this.set('onError', function() {
      assert.ok(true, '`onError` was triggered');
    });

    await render(hbs`
      {{x-button
        data-test-button=true
        text="click me"
        onClick=(action onClick)
        onError=(action onError)
      }}
    `)

    await click('[data-test-button]');
  });
});
