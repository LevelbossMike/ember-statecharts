# Tutorial

You can install `ember-statecharts` like any other ember addon:
 
```sh
ember install ember-statecharts
```

## A button component

To help you getting started with `ember-statecharts` we will walk through an
example of implementing a button component.

## Requirements

* Our button should indicate to users their ability to interact with them -
i.e. a button can be enabled or disabled and looks differently based on these states.

* The button should be able to trigger `actions` based on the `onClick`-property
passed to it. When the executed action takes time the button should indicate this to users

* We want application developers to be able to react to the `success` of the triggered action

* We want application developers to be able to react to `error`s of the triggered action

## Modeling behavior

We will model our behavior visually by putting our button statechart configuration
 into [`XState`'s visualizer tool](https://xstate.js.org/viz). We start by creating an `idle` and
`busy`-state - because the button can either sit around `idle` ready to be clicked or
be `busy` while the `onClick`-action we pass to it is executing.

```js
{
  initial: 'idle',
  states: {
    idle: {},
    busy: {}
  }
}
```
<iframe
  src="https://xstate.js.org/viz/?gist=d5e74a8a8c1f05bd440dd76549a7b709&embed=1"
  class="w-full h-64 my-12 prose"
>
</iframe>

When the user clicks the button we want to `transition` from the `idle`-state to the
`busy`-state. Statechart transitions happen based on events sent to the statechart.
We will model our statechart to transition based on the `SUBMIT`-event.

```js
{

  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: 'busy'
      }
    },
    busy: {}
  }
}
```

<iframe
 src="https://xstate.js.org/viz/?gist=9ff6131e1098dcc824921fc001dce356&embed=1"
 class="w-full h-64 my-12 prose"
/>

You can interact with the statechart during the modeling phase. You will see the statechart
transitionig into the busy state when clicking on the submit event in the statechart-visualizer.

### Triggering actions

Transitioning between states is not enough for our statechart to actually do something.
To have our statechart 'do' something we can implement `actions` that we will tell
the statechart to execute on state-transitions. You can trigger actions at specific points
of a transition:

* **entry** - when a state is entered
* **exit** - when a state is exited
* on a **transition** - when you want to trigger actions only on a specific transition

<Demo @onlySnippets={{true}} as |demo|>
  <demo.ui.useSnippet @name="quickstart-on-entry.js" @title="entry" />
  <demo.ui.useSnippet @name="quickstart-on-exit.js" @title="exit" />
  <demo.ui.useSnippet @name="quickstart-transition.js" @title="transition" />
</Demo>

<iframe
  src="https://xstate.js.org/viz/?gist=9fa21784f2531f6473fbc6e8881c8482&embed=1"
  class="w-full h-64 my-12 prose"
/>

To model the behavior  of our button component we decide to trigger the
`handleSubmit`-action every time we enter the `busy` state. The button will be in
the busy state and we  can then decide where to transition afterwards based on the
outcome of the triggered action.

This leads us to the conclusion that we actually are missing a state. There's
nowhere to transition to after `busy`. We seem to are missing a `success` state.

```js
{

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
        SUCCESS: 'success'
      }
    },
    success: {}
  }
}, {
  actions: {
    handleSubmit() {}
  }
}
```

<iframe
  class="w-full h-64 my-12 prose"
  src="https://xstate.js.org/viz/?gist=2130bab30555d3f19fa274cdf1a9eec5&embed=1"
/>

But what happens if the potentially async `onClick` fails? We need an `error`
state as well.

This is one of the advantages of using `ember-statecharts` to model behavior.
 Because you are modeling behavior explicitly you need to think about what can
 happen in your application _before_ actually implementing something. This will
lead you to really think about the use-case you are trying to implement and it
gets very easy to add states if you discover you missed something:

```js
{

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
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: {},
    error: {}
  }
}, {
  actions: {
    handleSubmit() {}
  }
}
```

<iframe
  class="w-full h-64 my-12 prose"
  src="https://xstate.js.org/viz/?gist=451d65175a1a572c2816f1a04a1cf149&embed=1"
/>

Ok now we can now transition into `error` and `success` but we want developers to
be able to handle these events so we will need to trigger behavior when each of
those states is entered. This is easy to do - we add a new actions `entry` for
both states:

```js
{

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
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: {
      entry: ['handleSuccess']
    },
    error: {
      entry: ['handleError']
    }
  }
}, {
  actions: {
    handleSubmit() {},
    handleSuccess() {},
    handleError() {}
  }
}
```

<iframe
  class="w-full h-64 my-12 prose"
  src="https://xstate.js.org/viz/?gist=75fa670f88452661b0cb1182c2391d9e&embed=1"
/>

This looks pretty good - let's have a quick look at the statechart-visualizer again.
When clicking through the visualizer we notice that our statechart behaves in kind of
a weird way. We can transition trough to `success` and `error` but there's no way
to exit those two states again. This might be good enough in your application but
most likely this indicates a problem. When dealing with a generic button
component it seems like we should be able to submit the button again after we
successfully submitted the button or the action triggered by the button failed.

This is something that is easily missed when not using a statechart to visualize
the behavior of your components. If you did not use a statechart you would be
setting conditional properties like `isLoading` on the button component directly
and you might have some kind of condition in your code that makes sure that your
button can not be submitted while its `isLoading` property is true. You then
would need to make sure to reset that property `onError` or `onSuccess` - but
this is easy to forget, very error prone and hard to reason about.
In contrast to working with implicit behavior with ember-statecharts
we simply add a new transition to both states:

```js
{

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
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: {
      entry: ['handleSuccess'],
      on: {
        SUBMIT: 'busy'
      }
    },
    error: {
      entry: ['handleError'],
      on: {
        SUBMIT: 'busy'
      }
    }
  }
}, {
  actions: {
    handleSubmit() {},
    handleSuccess() {},
    handleError() {}
  }
}
```

<iframe class="w-full h-64 my-12 prose" src="https://xstate.js.org/viz/?gist=ea9c345de6903dd1d3eb4992c85bb92a&embed=1" />

### Executing the modeled statechart

Modeling the statechart for our button component is complete now. But how do
we actually use this in our Ember.js application?

It's pretty easy actually. We take the statechart (XState calls them `Machine`s)
we modeled in the statechart-visualizer, create an instance of it and use it in
our component via the `useMachine`-[usable](https://github.com/emberjs/rfcs/pull/567)
that `ember-statecharts` provides.

In our example application we decided to create a `machines`-folder that holds
all the XState-`machine`s that we plan to use in our components. We can copy
and paste these out of the statechart-visualizer directly and paste them back into
the visualizer when we want to see how they work.

We then have to hook up the imported `machine` with our component. We can use
the `withContext`- and `withConfig`-hooks that are available when using `useMachine`.

The nice thing about this is that we keep the behavior separate from our
component implementation. The component that decides to use the statechart
defines what it expects to happen as external effects when the statechart
executes its behavior - we use the `withConfig`- hook to do this.

In our case
we tell the statechart to trigger the `performSubmitTask`-function and what
should happen when the async action triggered succeeds or errors. Because we
define these functions on the statechart itself we need to bind them to the
component instance - we do this by using the `@action`-decorator that Ember
provides in our example. If we didn't want to use `@action` we could use  [Function.prototype.bind](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) to achieve the same effect.

You can see the final component in action here:

<Docs::QuickstartGuide />

To trigger transitions on the statechart we implement regular Ember Component actions
that forward `events` to our component. If the user clicks the button we will send the
`SUBMIT` action to our statechart and the statechart will trigger a transition into
the appropriate state. If no transition is specified in the statechart for the sent
event nothing happens - it has literally become impossible to trigger unexpected behavior.

```js
// ...
export default class MyComponent extends Component {
  // ...
  @action
  buttonClicked() {
    this.statechart.send('SUBMIT');
  }
}
```

If a states doesn't understand an event nothing happens. You can see this
while the submit-task is performed. If the user clicks the button repeatedly
nothing happens. Because the `busy`-state does not handle the `SUBMIT`-event
it won't trigger the `submitTask` again.

When we want to keep the UI in sync with the statechart's state we can do this by
using the `matchesState`-decorator.

```js
// ...
export default class MyComponent extends Component {
  // ...
  // the second param is optional if the statechart is called `statechart`
  @matchesState('busy', 'statechart')
  isBusy;

  @use statechart = useMachine({
    // ...
  })
  // ...
}
```

The `matchesState`-decorator will be `true` if the passed state matches the
statechart's current state. You can match against a singular state, an array of
states and even match against nested and parallel states with this
decorator - please refer to the [working with
statecharts](/docs/statecharts)-section for details.

## Refining behavior

We implemented the expected submit behavior but we can't set the button in a
disabled state.

This isn't too surprising we have yet to model the disabled behavior.

The disabled-state is somewhat of an odd state because it concerns how the button looks
(e.g. a disabled button might show as greyed out) and how the button behaves 
(clicking the button won't trigger its `onClick`-action). Statecharts are used
to model behavior so we don't want to concern ourselves with the looks of the
button for now - we will get to that later. But first of all we need to figure out
how disabling the button fits into our statechart.

If we think about it the way the button handles clicks and the fact if the button
should be interactive are really two concurrent things. We could for example decide
to disable the button while the button is in the `busy`-state. Disabling the interactivity
of the button should most likely not cancel the submit-action.

We can model two concurrent behaviors - interactivity and activity in our example -
with a [parallel state](https://xstate.js.org/docs/guides/parallel.html):



```js
{
  type: 'parallel',
  states: {
    interactivity: {
      initial: 'unknown',
      states: {
        unknown: {
          on: {
            '': [
              {
                target: 'enabled',
                cond: 'isEnabled'
              },
              { target: 'disabled' }
            ],
          },
        },
        enabled: {
          on: {
            DISABLE: 'disabled',
          },
        },
        disabled: {
          on: {
            ENABLE: 'enabled',
          },
        },
      },
    },
    activity: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: {
              target: 'busy',
              cond: 'isEnabled',
            },
          },
        },
        busy: {
          entry: ['handleSubmit'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
          },
        },
        success: {
          entry: ['handleSuccess'],
          on: {
            SUBMIT: {
              target: 'busy',
              cond: 'isEnabled',
            },
          },
        },
        error: {
          entry: ['handleError'],
          on: {
            SUBMIT: {
              target: 'busy',
              cond: 'isEnabled',
            },
          },
        },
      },
    },
  },
},
{
  actions: {
    handleSubmit() {},
    handleSuccess() {},
    handleError() {},
  },
  guards: {
    isEnabled(context) {
      return !context.disabled;
    },
  },
}
```
To decide in which state - disabled or enabled - we "start" out in when we
first render the component we can make use of a [transient transition](https://xstate.js.org/docs/guides/transitions.html#transient-transitions). I.e. we will check the disabled property
of the statechart's context and transition into `disabled` or `enabled` based
on that property.

You can play with the `context`-property on the statechart visualization to
simulate a `disabled`-property that would be set from the outside in your Ember.js
application.

<iframe
  class="w-full my-12 h-128 prose"
 src="https://xstate.js.org/viz/?gist=1b7e330cb49ccc3367b293651fa89377&embed=1"
/>

This is great! To refine this behavior we barely had to touch the existing
statechart - we only extended existing behavior. We created a parallel state
`interactivity` that implemenents behavior to make it possible to `ENABLE` or
`DISABLE` the button. The parallel `activity`-state needs to take the `interactivity`
into account when deciding if we want to transition into different substates
when the statechart receives the `SUBMIT`-event but other than that we can be
sure our component behaves the same way as it did before.

### Handling external changes

We want to be able to disable the button via a param we pass to it:

```html
<QuickstartButton
  @onClick=this.doSomething
  @disabled={{@disableButton}}
>
  Click me!
</QuickstartButton>
```

In the context of statecharts we are modeling behavior based on states that
continiously react to internal and external events. In our button
component changing the `disabled`-argument can be treated as an external event
because something outside of the component changed the `disabled`-parameter.


This means we need to send an event to our button's statechart every time the
`disabled`-argument changes. We can use the [`.update`-hook](http://localhost:4200/docs/statecharts#-update-reacting-to-changes-to-usemachine) that
`useMachine`-provides to do that:

```js
export default class QuickstartButton extends Component {
  // ...

  @use statechart = useMachine(quickstartButtonRefinedMachine)
    .withContext({
      disabled: this.args.disabled,
    })
    .withConfig({
      actions: {
        handleSubmit: this.performSubmitTask,
        handleSuccess: this.onSuccess,
        handleError: this.onError,
      },
      guards: {
        isEnabled({ disabled }) {
          return !disabled;
        },
      },
    })
    .update(({ send, context }) => {
      const { disabled } = context;

      if (disabled) {
        send('DISABLE');
      } else {
        send('ENABLE');
      }
    });
  // ...
}
```

First we define the statechart's `context` object via `withContext`. In our
case the statechart's context is a plain object with a `disabled` property that
depends on the passed `disabled` argument. Whenever this property set from the
outside changes `useMachine` will reevaluate and trigger its `update`-hook. In
the `update`-hook we can send an event to the statechart based on the new
`context`-object that `withContext` will evaluate to.

So in our example we will send the `DISABLE` or `ENABLE` event based on what
was passed for `args.disabled`.

The `update`-hook will trigger every time a property passed to `useMachine`,
`withContext` or `withConfig` changes. `update` will be passed an object with
the following structure:

```
send: Function - a function to send an event to the statechart
restart:  Function - a function to teardown the old and restart a new interpreter with the new configuration
machine: The object passed to `useMachine`
context: the object passed to `withContext`
config: the object passed to `withConfig`
```

As you can see we can either `send` an event to the statechart or decide to `restart` the entire statechart. In our case we decided to model the `args`-change explicitly and because we don't want to throw away the existing state of the statechart we opted not to use `restart`.

### How things look vs. how things behave

Statecharts decouple behavior, i.e. the functionality of an `Ember.Component` from
the way the component looks. This means that we might want to present the button
as `disabled` not only in the `disabled`-state but also in other states of the
statechart that don't allow submitting the button. We can use a regular getter
to display the button correctly to our users:

```js

export default class QuickstartButton extends Component {
  // ...
  @matchesState({ activity: 'busy' })
  isBusy;

  @matchesState({ interactivity: 'disabled' })
  isDisabled;

  // we are not sure if the button is enabled or disabled because we have yet
  // to receive a `DISABLE` or `ENABLE` event
  @matchesState({ interactivity: 'unknown' })
  isInteractivityUnknown;

  get showAsDisabled() {
    const { isDisabled, isBusy, isInteractivityUnknown } = this;

    return isDisabled || isBusy || isInteractivityUnknown;
  }

  // ...
}
```

Here's the final component that we came up with:

<Docs::QuickstartFinal />

## Summary

In this tutorial you learned how you can use statecharts to explicitly model
behavior in your Ember.js applications. You have seen how you can make use of the
[XState-visualizer](https://xstate.js.org/viz/) to help you visualize what your components will
be doing. We also walked through how you can make your statechart executable via
the `useMachine`-[usable](https://github.com/emberjs/rfcs/pull/567) and how you can use the `matchesState`-decorator to
declaratively adapt the looks of your component based on state changes.

The rest of the guides will go into more detail of [how to work](/docs/statecharts)
with statecharts in your Ember.js applications. Please also remember that
everything that `ember-statecharts` is doing is backed by the great
[XState](https://xstate.js.org)-library. You can read about all the configuration
options that XState provides in the [documentation](https://xstate.js.org/docs/)
of that project. This is a very valuable resource that you certainly want to use
when you start using statecharts in your applications.
