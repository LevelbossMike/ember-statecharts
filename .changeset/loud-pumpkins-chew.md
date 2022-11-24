---
'ember-statecharts': minor
---

Port add-on to a proper [v2 add-on](https://github.com/embroider-build/embroider/blob/main/SPEC.md) setup.

This restructuring does change the behavior of the add-on slightly and is introducing breaking changes.

## 🥁 Features

### `use-machine` is now an `ember-resource`-resource
`ember-statecharts` now uses [ember-resources](https://github.com/NullVoxPopuli/ember-resources/tree/main) under the hood to provide its functionality. Make sure you install it as a dependency of your project:

```sh
ember install ember-resources
```

This doesn't change the way you use `useMachine` but comes with the additional benefit of you now having the possibilty to create resources in your application and model their behavior explicitly via `useMachine`:

Example:

```js
import { tracked } from '@glimmer/tracking';
import { Resource } from 'ember-resources';
import { useMachine } from 'ember-statecharts';
import asyncMachine from '../machines/async';

function noop = async function() {}

class Async extends Resource {
  @tracked onSuccess;
  @tracked onError;
  @tracked onSubmit;

  statechart = useMachine(this, () => {
    return {
      machine: asyncMachine.withConfig({
        actions: {
          onError,
          onSuccess,
        },
        services: {
          onSubmit
        }
      })
    }
  });

  submit = () => {
    this.statechart.send('SUBMIT');
  }

  retry = () => {
    this.statechart.send('RETRY');
  }

  get isBusy() {
    return this.statechart.state.matches('busy');
  }

  modify(positional, { onSubmit, onError, onSuccess}) {
    this.onSubmit = onSubmit || noop;
    this.onError = onError || noop;
    this.onSuccess = onSuccess || noop;
  }
}

// use it somewhere
import Async from '../resources/async';

class AsyncButton extends Component {
  async = Async.from(this, () => {
    return {
      onSubmit,
      onSuccess,
      onError
    }
  })

  get isDisabled() {
    return this.async.isBusy;
  }

  // ...
}
```

Please refer to the documentation of [ember-resources](https://github.com/NullVoxPopuli/ember-resources/tree/main) to learn more how to implement your own custom resources, and how to use them in your projects.

###

## 💥 Breaking changes

### `statechart`-computed-macro has been removed

The `@statechart`, i.e. the [computed based statechart API](https://ember-statecharts.com/versions/v0.9.0/docs/statecharts) has been removed from the add-on completely. `ember-statecharts` is a proper v2-addon now and chances
are that if you still rely on the `statechart`-computed you won't need to update to a v2-addon. The API also does
not play very well with the Octane paradigms.

### `@matchesState`-decorator removed

The [`@matchesState`-decorator](https://ember-statecharts.com/versions/v0.14.0/docs/statecharts#matching-state) has been removed. Decorators don't play very well with TypeScript and [matching against state](https://xstate.js.org/docs/guides/states.html#state-methods-and-properties) is a built-in feature of XState.

Refactoring your `@matchesState`-decorators towards reactive getters is rather simple:

```js
@matchesState({ interactivity: 'idle'})
isIdle;

// => refactor towards native getter

get isIdle() {
  return this.statechart.state.matches({ interactivity: 'idle' })
}
```
If you can't live without the decorator it is also rather simple to recreate it in your own project:

```ts
import { matchesState as xStateMatchesState } from 'xstate';

function matchesState(
  state: StateValue,
  statechartPropertyName = 'statechart'
): any {
  return function () {
    return {
      get(this: any): boolean {
        const statechart = this[statechartPropertyName] as
          | { state: { value: StateValue } }
          | undefined;

        if (statechart) {
          return xstateMatchesState(state, statechart.state.value);
        } else {
          return false;
        }
      },
    };
  };
}

// you can use this as a @matchesState-decorator
class ButtonComponent extends Component {
  statechart = useMachine(this, () => {
    // ...
  });

  @matchesState('busy') isBusy;
}
```