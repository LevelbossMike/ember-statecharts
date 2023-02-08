---
'ember-statecharts': minor
---

## 🥁 Features

### InterpreterOptions
Bring back ability to customize [InterpreterOptions](https://xstate.js.org/docs/guides/interpretation.html#options) that are used when a machine passed to `useMachine` gets interpreted. This is probably most useful for people that want to have xState delays etc. be scheduled via a custom clock service that uses [Ember's runloop](https://guides.emberjs.com/release/applications/run-loop/), but can be used to pass other [interpreterOptions](https://xstate.js.org/docs/guides/interpretation.html#options) as well.

To customize `interpreterOptions`, when you would like to provide the same options every time you use `useMachine`, you can create a wrapper-function for `useMachine`:

Example:

```js
const wrappedUseMachine = (context, options) => {
  return useMachine(context, () => {
    return {
      interpreterOptions: {
        clock: {
          setTimeout(fn, timeout) {
            later.call(null, fn, timeout);
          },
          clearTimeout(id) {
            cancel.call(null, id);
          },
        },
      },
      ...options(),
    };
  });
};

statechart = wrappedUseMachine(this, () => {
  // ...
});
```

### `runloopClockService`-configuration option
For the use-case of having xState timeouts etc. be schedule via the runloop, `ember-statecharts` now provides a configuration option. You can turn it on to have xState use a custom [clock](https://xstate.js.org/docs/guides/delays.html#interpretation) and schedule, and cancel timeouts via the ember-runloop. This makes testing via `@ember/test-helpers` arguably more ergonomic, as you won't need to explicitly await ui changes that are triggered by schedule statechart changes explicitly anymore.

Example - based on the test that tests this behavior:

```js
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

    // oh noes, we need to wait explicitly as xState uses `window.setTimeout` by default 😢
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

    // just awaiting the click is enough now, because we schedule delays on the runloop 🥳
    await click('[data-test-toggle]');

    assert.dom('[data-test-off]').exists('initially toggle is off');
  });
});
```

To turn on this behavior, you can set the `runloopClockService`-configuration in `config/environment.js`:

```js
ENV['ember-statecharts'] = {
  runloopClockService: true
}
```
