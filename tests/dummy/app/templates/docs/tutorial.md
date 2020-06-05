# Tutorial

You can install `ember-statecharts` like any other ember addon:
 
```
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

<div class="docs-mb-6 docs-text-grey-dark docs-text-xxs">
  If arrows in the vizualizations are a bit off try to change the browser
  width - this will fix the arrows
</div>

We will model our behavior visually by putting our button statechart configuration
 into [`xState`'s visualizer tool](https://xstate.js.org/viz). We start by creating an `idle` and
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
  class="docs-h-64 docs-w-full"
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
 class="docs-h-64 docs-w-full"
/>

You can interact with the statechart during the modeling phase. You will see the statechart
transitionig into the busy state when clicking on the submit event in the statechart-editor.

### Triggering actions

Transitioning between states is not enough for our statechart to actually do something.
To have our statechart 'do' something we can implement `actions` that we will tell
the statechart to execute on state-transitions. You can trigger actions at specific points
of a transition:

* **entry** - when a state is entered
* **exit** - when a state is exited
* on a **transition** - when you want to trigger actions only on a specific transition

{{#docs-demo as |demo|}}
  {{demo.snippet "quickstart-on-entry.js" label="entry"}}
  {{demo.snippet "quickstart-on-exit.js" label="exit"}}
  {{demo.snippet "quickstart-transition.js" label="transition"}}
{{/docs-demo}}

<iframe
  src="https://xstate.js.org/viz/?gist=9fa21784f2531f6473fbc6e8881c8482&embed=1"
  class="docs-h-64 docs-w-full"
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
  class="docs-w-full docs-h-64"
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
  class="docs-h-64 docs-w-full"
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
  class="docs-h-64 docs-w-full"
  src="https://xstate.js.org/viz/?gist=75fa670f88452661b0cb1182c2391d9e&embed=1"
/>

This looks pretty good - let's have a quick look at the statechart-editor again.
When clicking through the editor we notice that our statechart behaves in kind of
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

<iframe class="docs-w-full docs-h-64" src="https://xstate.js.org/viz/?gist=ea9c345de6903dd1d3eb4992c85bb92a&embed=1" />

### Executing the modeled statechart

Modeling the statechart for our button component is complete now. But how do
we actually use this in our Ember.js application?

It's pretty easy actually. We take the statechart (xstate calls them `Machine`s)
we modeled in the statechart-editor, create an instance of it and use it in
our component via the `useMachine`-[usable](https://github.com/emberjs/rfcs/pull/567)
that `ember-statecharts` provides.

In our example application we decided to create a `machines`-folder that holds
all the xstate-`machine`s that we plan to use in our components. We can copy
and paste these out of the statechart-editor directly and paste them back into
the editor when we want to see how they work.

We then have to hook up the imported `machine` with our component. We can use
the `withContext` and `withConfig` that are available when using `useMachine`.

The nice thing about this is that we keep the behavior separate from our
component implementation. The component that decides to use the statechart
defines what it expects to happen as external effects when the statechart
executes its behavior. We also define the `context` of the statechart
explicitly when using `useMachine` - in this case we define a reference
`component` on the statechart context so that we can access the component
instance directly when the statechart executes its actions.

You can see the final component in action here:

{{docs/quickstart-guide}}

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
  @matchesState('busy')
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
            ENABLE: 'enabled',
            DISABLE: 'disabled'
          }
        },
        enabled: {
          on: {
            DISABLE: 'disabled'
          }
        },
        disabled: {
          on: {
            ENABLE: 'enabled'
          }
        }
      }
    },
    activity: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: {
              target: 'busy', cond: 'isEnabled'
            }
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
           SUBMIT: {
             target: 'busy', cond: 'isEnabled'
           }
          }
        },
        error: {
          entry: ['handleError'],
          on: {
           SUBMIT: {
             target: 'busy', cond: 'isEnabled'
           }
          }
        },
      }
    }
  }
}, {
  actions: {
    handleSubmit() {},
    handleSuccess() {},
    handleError() {}
  },
  guards: {
    isEnabled(context) {
      return context.isEnabled;
    } 
  },
}
```

You can play with the `context`-property on the statechart visualization to
simulate a property that would be set from the outside in your Ember.js
application.

<iframe
  class="docs-h-128 docs-w-full"
 src="https://xstate.js.org/viz/?gist=4618189a77e8564c237af21119062f99&embed=1"
/>

This is great! To refine this behavior we barely had to touch the existing statechart. We
created a parallel state `interactivity` that implemenents behavior to make it
possible to `ENABLE` or `DISABLE` the button. The parallel `activity`-state
needs to take the `interactivity` into account when deciding if we want to transition
into different substates when the statechart receives the `SUBMIT`-event but
other than that we can be sure our component behaves the same way as it did before.

### Handling external changes - `@disabled={{true}}`

We want to be able to disable the button via a param we pass to it:

```hbs
<QuickstartButton
  @onClick=this.doSomething
  @disabled={{disableButton}}
>
  Click me!
</QuickstartButton>
```

In the context of statecharts we are modeling behavior based on states that
continiously react to internal and external events. In our button
component changing the `disabled`-argument can be treated as an external event
because something outside of the component changed the `disabled`-parameter.


This means we need to send an event to our button's statechart every time the
`disabled`-argument changes. We can handle this with the
[@ember/render-modifiers](https://github.com/emberjs/ember-render-modifiers)-addon.

```hbs
<button
  {{!-- ... --}}

  {{!-- handle @disabled when rendering --}}
  {{did-insert this.handleDisabled @disabled}}
  {{!-- handle @disable on every change --}}
  {{did-update this.handleDisabled @disabled}}

  {{!-- ... --}}
>
```

Finally we need to add the `handleDisabled`-action to our component code to
notify our statechart of the argument change:

```js
export default class QuickstartButton extends Component {
  // ...

  @action
  handleDisabled(_element, [disabled]) {
    if (disabled) {
      this.statechart.send('DISABLE');
    } else {
      this.statechart.send('ENABLE');
    }
  }
}
```


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

{{docs/quickstart-final}}

## Summary

In this tutorial you learned how you can use statecharts to explicitly model
behavior in your Ember.js applications. You have seen how you can make use of the
[statechart-editor](/editor) to help you visualize what your components will
be doing. We also walked through how you can make your statechart executable via
the `useMachine`-[usable](https://github.com/emberjs/rfcs/pull/567) and how you can use the `matchesState`-decorator to
declaratively adapt the looks of your component based on state changes.

The rest of the guides will go into more detail of [how to work](/docs/statecharts)
with statecharts in your Ember.js applications. Please also remember that
everything that `ember-statecharts` is doing is backed by the great
[xstate](https://xstate.js.org)-library. You can read about all the configuration
options that xstate provides in the [documentation](https://xstate.js.org/docs/)
of that project. This is a very valuable resource that you certainly want to use
when you start using statecharts in your applications.
