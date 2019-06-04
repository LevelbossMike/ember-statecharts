# Quickstart

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

We will model our behavior visually by putting our button statechart configuration
 into the [statechart-editor](/editor). We start by creating an `idle` and
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

{{es-statechart statechart=quickstartStepOne}}

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

{{es-statechart statechart=quickstartStepTwo}}

You can interact with the statechart during the modeling phase. You will see the statechart
transitionig into the busy state when clicking on the submit event in the statechart-editor.

### Triggering actions

Transitioning between states is not enough for our statechart to actually do something.
To have our statechart 'do' something we can implement `actions` that we will tell
the statechart to execute on state-transitions. You can trigger actions at specific points
of a transition:

* **onEntry** - when a state is entered
* **onExit** - when a state is exited
* on a **transition** - when you want to trigger actions only on a specific transition

{{#docs-demo as |demo|}}
  {{demo.snippet "quickstart-on-entry.js" label="onEntry"}}
  {{demo.snippet "quickstart-on-exit.js" label="onExit"}}
  {{demo.snippet "quickstart-transition.js" label="transition"}}
{{/docs-demo}}

{{es-statechart statechart=quickstartStepThree}}

To model the behavior  of our button component we decide to trigger the
`handleSubmit`-action everytime we enter the `busy` state. The button will be in
the busy state and we  can then decide where to transition afterwards based on the
outcome of the triggered action.

This leads us to the conclusion that we actually are missing a state. There's
nowhere to transition to after `busy`. We seem to are missing a `success` state.

So when `onClick`

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
      onEntry: ['handleSubmit'],
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

{{es-statechart statechart=quickstartStepFour}}

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
      onEntry: ['handleSubmit'],
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

{{es-statechart statechart=quickstartStepFive}}

Ok now we can now transition into `error` and `success` but we want developers to
be able to handle these events so we will need to trigger behavior when each of
those states is entered. This is easy to do - we add a new actions `onEntry` for
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
      onEntry: ['handleSubmit'],
      on: {
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: {
      onEntry: ['handleSuccess']
    },
    error: {
      onEntry: ['handleError']
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

{{es-statechart statechart=quickstartStepSix}}

This looks pretty good - let's have a quick look at the statechart-editor again.
When clicking through the editor we notice that our statechart behaves in kind of
a weird way. We can transition trough to `success` and `error` but there's no way
to exit those two states again. This might be good enough in your application but
most likely this indicates a problem. When dealing with a generic button
component it seems like we should be able to submit the button again after we
successfully submitted the button or the action triggered by the button failed.

This is something that is easily missed when not using a statechart to visualize
the behavior of your components. If you did not use a statechart you would be
setting conditional properties like `isLoading` on the button component direclty
and you might have some kind of condition in your code that makes sure that your
button can not be submitted while its `isLoading` property is true. You then
would need to make sure to reset that property `onError` or `onSuccess` etc..
This is very error prone and hard to reason about. In contrast with ember-statecharts
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
      onEntry: ['handleSubmit'],
      on: {
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: {
      onEntry: ['handleSuccess'],
      on: {
        SUBMIT: 'busy'
      }
    },
    error: {
      onEntry: ['handleError'],
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

{{es-statechart statechart=quickstartStepSeven}}

### Executing the modeled statechart

Modeling the statechart for our button component is complete now. But how do
we actually use this in our Ember.js application?

It's pretty easy actually. We take the statechart we modeled in the statechart-editor
and put it into our component via the `statechart`-computed macro `ember-statecharts` provides.

You can see the final component in action here:

{{docs/quickstart-guide}}

To trigger transitions on the statechart we implement regular Ember Component actions
that forward `events` to our component. If the user clicks the button we will send the
`SUBMIT` action to our statechart and the statechart will trigger a transition into
the appropriate state. If no transition is specified in the statechart for the sent
event nothing happens - it has literally become impossible to trigger unexpected behavior.

```js
// ...
export default Component.extend({
  // ...
  actions: {
    buttonClicked() {
      this.statechart.send('SUBMIT');
    }
  }
})
```

If a states doesn't understand an event nothing happens. You can see this
while the submit-task is performed. If the user clicks the button repeatedly
nothing happens. Because the `busy`-state does not handle the `SUBMIT`-event
it won't trigger the `submitTask` again.

When we want to keep the UI in sync with the statechart's state we can do this by
using the `matchesState`-computed. 

```js
// ...
export default Component.extend({
  // ...
  isBusy: matchesState('busy'),

  statechart: statechart(
    // ...
  ),
})
```

The `matchesState`-computed will be `true` if the passed state matches the
statechart's current state. You can match against a singular state, an array of
states and even match against nested and orthogonal states with this
computed-macro - please refer to to [advanced usage](/advanced) for details.

### Refining behavior

We implemented the expected submit behavior but we can't set the button in a
disabled state.