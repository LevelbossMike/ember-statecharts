import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Promise } from 'rsvp';

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

    click(this.element.querySelector('button'));
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
});
