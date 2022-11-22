---
order: 3
---
# How-To Guides

## `XState`
Everything that `ember-statecharts` is doing is powered by the wonderful [`XState`-library](https://xstate.js.org/). The [`XState`-guides](https://xstate.js.org/docs/) provide extensive documentation about how to write statechart-configurations - please make use of this invaluable resource.

`ember-statecharts` is trying to provide a thin layer over `XState`'s APIs and
make it as easy as possible to use all of `XState`'s functionality with
`Ember.js`. It makes sure your statecharts play nice with the Ember-runloop and can react to outside arguments changing and takes care of cleaning up your statecharts when components get destroyed.

## Authoring `statechart`-configurations

To implement a statechart via `ember-statecharts` you will make use of the
`useMachine`- [resource](https://github.com/emberjs/rfcs/pull/567) exported from
`ember-statecharts`.

There are multiple ways to create a `statechart` that can be used by `useMachine`:

* use `useMachine` with an instance of an `XState`-`Machine` - [Machine](https://xstate.js.org/docs/guides/machines.html#configuration)
* use `useMachine` by using `XState`'s - `createMachine` - [createMachine](https://xstate.js.org/docs/guides/typescript.html#typestates);

The important thing is to pass an [XState-Machine](https://xstate.js.org/docs/guides/machines.html) as the machine property of the object that gets returned from `useMachine`.

Here's an example that reflects the [nested statechart](https://xstate.js.org/docs/#hierarchical-nested-state-machines)-example from the [`XState`-guides](https://xstate.js.org/docs/) in all two variants:

### `useMachine` with a `Machine`-instance

```js
import Component from '@glimmer/component';

import { Machine } from 'xstate';

import { useMachine } from 'ember-statecharts';

const machine = Machine({
  id: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow'
      }
    },
    yellow: {
      on: {
        TIMER: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green'
      },
      initial: 'walk',
      states: {
        walk: {
          on: {
            PED_TIMER: 'wait'
          }
        },
        wait: {
          on: {
            PED_TIMER: 'stop'
          }
        },
        stop: {}
      }
    }
  }
});

export default class MyComponent extends Component {
  statechart = useMachine(this, () => {
    return {
      machine
    }
  })
}
```

### `useMachine` with `createMachine`

```js
import Component from '@glimmer/component';

import { createMachine } from 'xstate';

import { useMachine } from 'ember-statecharts';

export default class MyComponent extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: createMachine({
        id: 'light',
        initial: 'green',
        states: {
          green: {
            on: {
              TIMER: 'yellow'
            }
          },
          yellow: {
            on: {
              TIMER: 'red'
            }
          },
          red: {
            on: {
              TIMER: 'green'
            },
            initial: 'walk',
            states: {
              walk: {
                on: {
                  PED_TIMER: 'wait'
                }
              },
              wait: {
                on: {
                  PED_TIMER: 'stop'
                }
              },
              stop: {}
            }
          }
        }
      })
    }
  })
}
```

To get a detailed overview about the configuration options available via `XState` please have a look at the [XState documentation](https://xstate.js.org/docs).

## Sending events

When implementing behavior with statecharts you have to switch your mental model
a bit when implementing Ember.js application behavior. The important thing is that
you won't trigger behavior directly based on user-interaction or external events
anymore - you will forward the event that happened to your statechart and let the
statechart figure out what will happen based on the event that you forwarded.

This means that you will want to change actions like this:

```js
export default class MyComponent extends Component {
  // ...

  @action
  buttonClicked() {
    this.doSomethingAsync();
  }
}
```

to something like the following:

```js
import { createMachine } from 'xstate';

const buttonMachine = createMachine(
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SUBMIT: 'busy'
        }
      },
      busy: {
        invoke: {
          src: 'handleSubmit',
          onDone: 'success',
          onError: 'error'
        }
      },
      success: {},
      error: {}
    }
  },
  {
    services: {
      handleSubmit: async (/* context, event */) {}
    }
  }
);

export default class MyComponent extends Component {
  // ...

  @use statechart = useMachine(this, () => {
    const { doSomethingAsync } = this;

    return {
      machine: buttonMachine
        .withConfig({
          services: {
            handleSubmit: doSomethingAsync
          }
        })
    }

  // ...

  @action
  buttonClicked() {
    this.statechart.send('SUBMIT');
  }
};
```

This might seem like an annoying level of indirection first but soon you will notice
that this indirection provides a safety net for your application behavior. Instead
of the burden of keeping track of the implicit states that your application can find itself in,
in your head all the time you will model your behavior explicitly and let the statechart figure
out what needs to happen. In the above example, users can't retrigger the 
`doSomethingAsync` when they trigger the `buttonClicked`-action repeatedly while the statechart
finds itself in the `busy` state for example.

### The statechart's context - using `withContext`

The Object that uses the `useMachine`-usable can specify the
`context` of the statechart explicitly by using <a href="https://xstate.js.org/docs/guides/machines.html#extending-machines" target="_blank" rel="noopener noreferrer"><code>withContext</code></a>. This makes sure
that you can design your behavior inside of `XState`'s
[visualizer](https://xstate.js.org/viz/) completely and then have the calling
Object define what it considers the `context` of the statechart to be.

This means you have the component decide what context will be used when
[`guards`](https://xstate.js.org/docs/guides/guards.html) and
[`actions`](https://xstate.js.org/docs/guides/actions.html) are executed.

```js
import { Machine } from 'xstate';

const buttonMachine = Machine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: 'busy'
      }
    },
    busy: {
      invoke: {
        src: 'handleSubmit',
        onDone: 'success',
        onError: 'error'

      }
    },
    success: {},
    error: {}
  }
}, {
  actions: {
    handleSubmit(context) {
      // `context` is set to whatever object we pass to `withContext`
      const { doSomethingAsync } = context;

      return doSomethingAsync();
    }
  }
});

export default class MyComponent extends Component {
  // ...
  statechart = useMachine(this, () => {
    const { doSomethingAsync } = this;

    return {
      machine: buttonMachine
        .withContext({
          doSomethingAsync
        })
    }
  })

  @action
  buttonClicked() {
    this.statechart.send('SUBMIT');
  }
}
```

### Customizing the statechart's config - using `withConfig`

As with `withContext` the calling Object can also customize the statechart's
configuration by using <a href="https://xstate.js.org/docs/guides/machines.html#extending-machines" target="_blank" rel="noopener noreferrer"><code>withConfig</code></a>. This makes sure that you can design your
behavior inside of `XState`'s [visualizer](https://xstate.js.org/viz/) completely
and then have the calling Object define what external effects will be triggered
when the statechart triggers `actions` or what checks to run when it executes
`guards`.

```js
import { Machine } from 'xstate';

const submitMachine = Machine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: 'busy',
          cond: 'allNecessaryDataIsAvailable'
        }
      }
    },
    busy: {
      entry: ['handleSubmit'],
      on: {
        RESOLVE: 'success',
        REJECT: 'error'
      }
    },
    success: {},
    error: {}
  }
}, {
  actions: {
    handleSubmit(/* context, eventObject */) {}
  },
  guards: {
    allNecessaryDataIsAvailable(/* context, eventObject */) {}
  }
});

export default class MyComponent extends Component {
  @tracked
  name = '';

  @tracked
  password = '';

  statechart = useMachine(this, () => {
    return {
      machine: submitMachine
        .withContext({
          component: this
        })
        .withConfig({
          actions: {
            handleSubmit({ component }, eventObject) {
              const { email, password } = eventObject;

              component.loginTask.perform(email, password);
            }
          },
          guards: {
            allNecessaryDataIsAvailable({ component }, eventObject) {
              const { email, password } = component;

              return email && password;
            }
          }
        })
    }
  });

  // ...

  @action
  buttonClicked() {
    this.statechart.send('SUBMIT');
  }
}
```

### Including event data

When sending an event to your statechart you can send data with that event. The
sent data will be available in [`guards`](https://xstate.js.org/docs/guides/guards.html) and
[`actions`](https://xstate.js.org/docs/guides/actions.html) that are executed based
on the sent event:

```js
import { Machine } from 'xstate';

const submitMachine = Machine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: 'busy',
          cond: 'allNecessaryDataIsAvailable'
        }
      }
    },
    busy: {
      entry: ['handleSubmit'],
      on: {
        RESOLVE: 'success',
        REJECT: 'error'
      }
    },
    success: {},
    error: {}
  }
}, {
  actions: {
    handleSubmit(/* context, eventObject */) {}
  },
  guards: {
    allNecessaryDataIsAvailable(/* context, eventObject */) {}
  }
});

export default class MyComponent extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: submitMachine
        .withContext({
          component: this
        })
        .withConfig({
          actions: {
            handleSubmit({ component }, eventObject) {
              const { email, password } = eventObject;

              component.loginTask.perform(email, password);
            }
          },
          guards: {
            allNecessaryDataIsAvailable(context, eventObject) {
              const { email, password } = eventObject;

              return email && password;
            }
          }
        })
    }
  });

  // ...

  @action
  buttonClicked() {
    const { email, password } = this;

    this.statechart.send('SUBMIT', { email, password });
  }
}
```

## Matching state

You can declaratively react to state changes in your statechart by making use
of regular getters. This means that when you want to for
example display a button component differently based on the state it finds
itself in this is very easy to do with `ember-statecharts`:

```js
import { useMachine} from 'ember-statecharts';

export default class MyComponent extends Component {
  // ...
  statechart = useMachine(this, () => {
    return {
      machine:  Machine({
        initial: 'idle',
        states: {
          idle: {
            on: {
              SUBMIT: 'busy'
            }
          },
          busy: {
            entry: ['handleSubmit'],
            on: {
              RESOLVE: 'success',
              REJECT: 'error'
            }
          },
          success: {},
          error: {}
        }
      })
    }
  })

  get didError() {
    return this.statechart.state.matches('error');
  }
}
```
<br>

```hbs
<button class="{{if this.didError "btn btn__error" "btn"}}">
  Click me
</button>
```

You can pass a [`StateValue`](https://xstate.js.org/api/globals.html#statevalue)
to `matches`. This means you can also match
against nested or [parallel](https://xstate.js.org/docs/guides/parallel.html)
states:

```js
// atomic state node
this.statechart.matches('idle');

// nested state
this.statechart.state.matches({ error: 'apiError' });

// parallel state
this.statechart.matches({
  validity: 'invalid',
  interaction: {
    changed: 'fieldBlurred'
  }
})
```

## `.update` - Reacting to changes to `useMachine`

When args or state passed to `useMachine`, `withConfig` or `withContext` change
users can react to the change without needing to use
[@ember/render-modifiers](https://github.com/emberjs/ember-render-modifiers) or
[ember-render-helpers](https://github.com/buschtoens/ember-render-helpers) to
send an event to the statechart.

To demonstrate this behavior we'll create a `CounterMachine` that implements
counting behavior. The component that uses it will be passed a `count`-arg.
Whenever this arg changes we want to react to the change:

We can react to the change in two ways.

1) We send an event to the statechart on `update` and the statechart reacts to the change as it would to any other external or internal event - in our case this means we reset `context.count` to the count-arg we receive in the update:

<Demo as |demo|>
  {{!-- BEGIN-SNIPPET counter-example --}}
  <Counter @count={{this.counterCount}} />
  <div class="flex justify-end mt-12">
    <input
      value={{this.count}}
      class="p-1 mr-2 border-2 rounded-sm"
      {{on "input" this.updateCount}}
    >
    <UiButton
      {{on "click" this.syncCounterCount}}
    >
      Update Counter-Count
    </UiButton>
  </div>
  {{!-- END-SNIPPET --}}
  <demo.ui.useSnippet @name="counter-update-event.js" @title="components.js" />
  <demo.ui.useSnippet @name="counter-machine.js" @title="counter-machine" />
  <demo.ui.useSnippet @name="counter-example.md" @title="template.hbs" @language="handlebars" />
</Demo>

2) We restart the entire underlying [XState-interpreter](https://xstate.js.org/docs/guides/interpretation.html) and end up with a statechart as if we accessed it for the first time with the update `machine`, `context` or `config`. In our case, this means that we will end up in the `inactive`-state again even if we were in the `active` state before.

<Demo as |demo|>
  {{!-- BEGIN-SNIPPET counter-restart --}}
  <CounterRestart @count={{this.counterCount}} />
  <div class="flex justify-end mt-12">
    <input
      value={{this.count}}
      class="p-1 mr-2 border-2 rounded-sm"
      {{on "input" this.updateCount}}
    >
    <UiButton {{on "click" this.syncCounterCount}}>
      Update Counter-Count
    </UiButton>
  </div>
  {{!-- END-SNIPPET --}}
  <demo.ui.useSnippet @name="counter-update-restart.js" @title="components.js" />
  <demo.ui.useSnippet @name="counter-machine.js" @title="counter-machine" />
  <demo.ui.useSnippet @name="counter-restart.md" @title="template.hbs" @language="handlebars" />
</Demo>

How you choose to handle an update to args/state passed to `useMachine` - either
sending an event or restarting the interpreter - depends on the situation you
find yourself in. If your situation allows throwing away the current state of
the statechart restarting could be an option to consider. If you need to
consider the current state when args change you will most likely find it easier
to send an event to the statechart instead of restarting the entire
interpreter.

## `.onTransition`

Sometimes you don't want to react to a particular state change on the interpreter
but trigger behavior on the outside on __every__ single state change - e.g. when you
want to persist a state change to be able to rehydrate the state later on.
Usually, you would trigger side-effects based on state transitions via
[actions](https://xstate.js.org/docs/guides/actions.html) but adding the same
action to every single state gets unergonomic quickly.

To make this more ergonomic `ember-statecharts` provides the `onTransition`-hook
that you can use to trigger a side-effect on __every__ state change.

```js
import SomeMachine from '../machines/some-machine';

export default class SignUpWizard extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: SomeMachine,
      onTransition: (state) => {
        this.persistState(state);
      }
    }
  })

  // ...

  persistState(state) {
    // ... persist state for later rehydration
  }
}
```

Please be aware that `onTransition` is meant as an escape mechanism and not to
be used as the primary way to trigger side-effects based on state transitions -
you want to use [actions](https://xstate.js.org/docs/guides/actions.html) for
that instead.

## Working with TypeScript

`ember-statecharts` itself is implemented in TypeScript and fully supports
Ember.js apps that are written in TypeScript. Due to the way XState works
internally, it is rather verbose to type your machines but as always with
TypeScript you will end up with better developer ergonomics than you would when
not typing your code.

Please refer to the [using TypeScript](https://xstate.js.org/docs/guides/typescript.html#using-typescript) of the XState docs for a thorough walkthrough on how to type your XState machines. For `useMachine` to pickup types correctly you will need to provide type information for `useMachine` explicitly.

The `useMachine`-API supports both versions of typing machines:

1. Without typestates: `useMachine<TContext, TStateSchema, TEvent>(/* ... */)`
2. With typestates: `useMachine<TContext, any, TEvent, TTypestate>(/* ... */)`

Next up you see an example of the `Button`-component from the tutorial
implemented in TypeScript:

<Docs::TypescriptUsage />

## Visualizing statecharts

To visualize your statecharts you can use the [XState visualizer](https://xstate.js.org/viz/).

## Further reading

`XState` comes with a comprehensive [documentation page](https://xstate.js.org/docs/) - it goes into great detail about what things you can do in `statechecart`-configurations.

Writing statecharts configurations is very easy once you are used to the syntax but feel free to consult the [`XState`-guides](https://xstate.js.org/docs/) as often as necessary to get the hang of it.
