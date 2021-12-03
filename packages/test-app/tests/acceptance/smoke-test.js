import { module, test } from 'qunit';
import { visit, click, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

class TogglePage {
  constructor(scope) {
    this.scope = scope;
  }

  get content() {
    return find(`${this.scope} [data-test-content]`);
  }

  toggle() {
    return click(`${this.scope} [data-test-toggle-button]`);
  }
}

async function runToggleTest(page, assert) {
  assert.dom(page.content).hasText('Off', 'machine is off by default');

  await page.toggle();

  assert.dom(page.content).hasText('On', 'toggling turns machine on');

  await page.toggle();

  assert
    .dom(page.content)
    .hasText('Off', 'toggling again turns machine off again');
}

module('Acceptance | smoke', function (hooks) {
  setupApplicationTest(hooks);

  test('@statechart computed api works', async function (assert) {
    assert.expect(3);

    await visit('/');

    const page = new TogglePage('[data-test-computed]');

    await runToggleTest(page, assert);
  });

  test('use-machine api works', async function (assert) {
    assert.expect(3);

    await visit('/');

    const page = new TogglePage('[data-test-use-machine]');

    await runToggleTest(page, assert);
  });
});
