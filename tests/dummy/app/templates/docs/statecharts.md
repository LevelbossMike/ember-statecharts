# Working with statecharts

## `xstate`
Everything that `ember-statecharts` is doing is powered by the wonderful [`xstate`-library](https://xstate.js.org/). The [`xstate`-guides](https://xstate.js.org/docs/) provide extensive documentation about how to write statechart-configurations - please make use of this invaluable resource.

## Authoring `statechart`-configurations

To implement a statechart via `ember-statecharts` all you have to do is to pass a valid `xstate`-statechart configuration to the `statechart`-computed macro exported from `ember-statecharts/computed`.

Here's an example that reflects the [nested statechart](https://xstate.js.org/docs/#hierarchical-nested-state-machines)-example from the [`xstate`-guides](https://xstate.js.org/docs/):

```js
import Component from '@ember/component';
import { statechart } from 'ember-statecharts/computed';

export default Component.extend({
  statechart: statechart({
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
  }),
});

```

To get a detailed overview about the configuration options available via `xstate` please have a look at the [xstate documentation](https://xstate.js.org/docs).

## Sending events

When implementing behavior with statecharts you have to switch your mental model
a bit when implementing Ember.js application behavior. The important thing is that
you won't trigger behavior directly based on user-interaction or external events
anymore - you will forward the event that happened to your statechart and let the
statechart figure out what will happen based on the event that you forwarded.

This means that you will want to change actions like this:

```js
export default Component.extend({
  // ...

  actions: {
    buttonClicked() {
      this.buttonClickedTask.perform();
    }
  }
})
```

to something like the following:

```js
export default Component.extend({
  // ...

  statechart: statechart({
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
          RESOLVE: 'success',
          REJECT: 'error'
        }
      },
      success: {},
      error: {}
    }
  }, {
    actions: {
      handleSubmit(context) {
        context.buttonClickedTask.perform();
      }
    }
  }),

  actions: {
    buttonClicked() {
      this.statechart.send('SUBMIT');
    }
  }
});
```

This might seem like an annoying level of indirection first but soon you will notice
that this indirection provides a safety net for your application behavior. Instead
of the burden of keeping track of the implicit states that your application can find itself in
in your head all the time you will model your behavior explicitly and let the statechart figure
out what needs to happen. In the above example users can't retrigger the 
`buttonClickedTask` when they trigger the `buttonClicked` repeatetly while the statechart
finds itself in the `busy` state for example.

### The statechart's context

The statechart context will automatically be set to the `Ember.Object` that
implements the statechart. This means you have the component implementing the
statechart available when [`guards`](https://xstate.js.org/docs/guides/guards.html) and
[`actions`](https://xstate.js.org/docs/guides/actions.html) are executed.

```js
export default Component.extend({
  // ...

  statechart: statechart({
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
          RESOLVE: 'success',
          REJECT: 'error'
        }
      },
      success: {},
      error: {}
    }
  }, {
    actions: {
      handleSubmit(context) {
        // `context` references the component that implements the statechart
        context.buttonClickedTask.perform();
      }
    }
  }),

  buttonClickedTask: task(function*() {
    // ...
  }),

  actions: {
    buttonClicked() {
      this.statechart.send('SUBMIT');
    }
  }
});
```

### Including event data

When sending an event to your statechart you can send data with that event. The
sent data will be available in [`guards`](https://xstate.js.org/docs/guides/guards.html) and
[`actions`](https://xstate.js.org/docs/guides/actions.html) that are executed based
on the sent event:

```js
export default Component.extend({
  statechart: statechart({
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
        onEntry: ['handleSubmit'],
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
      handleSubmit(context, eventObject) {
        const { email, password } = eventObject;

        context.loginTask.perform(email, password);
      }
    },
    guards: {
      allNecessaryDataIsAvailable(context, eventObject) {
        const { email, password } = eventObject;

        return email && password;
      }
    }
  }),

  // ...

  actions: {
    buttonClicked() {
      const { email, password } = this;

      this.statechart.send('SUBMIT', { email, password });
    }
  },
})
```

## Matching state

You can declaratively react to state changes in your statechart by making use
of the `matchesState`-computed-macro. This means that when you want to for
example display a button component differently based on the state it finds
itself in this is very easy to do with `ember-statecharts`:

```js
export default Component.extend({
  // ...
  statechart: statechart({
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
          RESOLVE: 'success',
          REJECT: 'error'
        }
      },
      success: {},
      error: {}
    }
  }, {
    // ...
  }),

  didError: matchesState('error')
});
```

```hbs
<button class={{if didError "btn btn__error" "btn"}}>
  Click me
</button>
```

You can pass a [`StateValue`](https://xstate.js.org/api/globals.html#statevalue) or
an array of `StateValue`s to `matchesState`. This means you can also match
against nested or [parallel](https://xstate.js.org/docs/guides/parallel.html)
states:

```js
// atomic state node
matchesState('idle')

// nested state
matchesState({ error: 'apiError' })

// parallel state
matchesState({
  validity: 'invalid',
  interaction: {
    changed: 'fieldBlurred'
  }
})

// matching multiple states
matchesState(['invalid', { error: 'remoteValidationError' }])
```

## Visualizing statecharts

Statecharts can be visualized with the [statechart-editor](/editor). For day to
day use it should be good enough to use the one available on this documentation
page but if you want to add this to your own styleguides or someplace else in
your applications directly you can use the [ember-statecharts-tools](https://github.com/effective-ember/ember-statecharts-tools/tree/master/addon/components)-
addon. This addon provides the tooling that is used in this documentation to visualize
statecharts.

The tooling addon is alpha-level software - please report bugs if you run into
issues.

## ES6 classes and decorators

`ember-statecharts` can be used with ES6 classes. Because the
`statechart`-macro is implemented as a computed-property you can use it like
a decorator - same goes for `matchesState`.

```js
export default class UiButton extends Component {
  @matchesState('error')
  didError;

  // ...

  @statechart(
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
            RESOLVE: 'success',
            REJECT: 'error'
          }
        },
        success: {},
        error: {}
      }
    },
    {
      actions: {
        handleSubmit(/* context, eventObject */) {
          // ...
        }
      }
    }
  )
  statechart;

  // ...

  @action
  buttonClicked() {
    this.statechart.send('submit');
  }
}
```

## Caution: Actors and `invoke` 

All of `xstate`'s features are supported but not all of them are useful in the context of an `Ember.js`-application. For example due to the programming model that the framework provides direct communication between statecharts should be used with care - there's most likely a cleaner way to do what you are trying to do while staying on the path that `Ember.js` recommends.

If you don't have a `Ember.Service`-layer available to allow your various objects to access global state in a clean way it might make sense to allow interaction between statecharts directly via [Actor](https://xstate.js.org/docs/guides/actors.html#actor-api)s or [Invoking Services](https://xstate.js.org/docs/guides/communication.html#the-invoke-property) - in `Ember.js` we have other means of communicationa available to us though. We encourage to our users the usage of `Ember.Service` and `data-down-actions-up` over using `xstate`'s `Actors` and `invoke`.

## Further reading

`xstate` comes with a comprehensive [documentation page](https://xstate.js.org/docs/) - it goes into great detail about what things you can do in `statechecart`-configurations.

Writing statecharts configurations is very easy once you are used to the syntax but feel free to consult the [`xstate`-guides](https://xstate.js.org/docs/) as often as necessary to get the hang of it.
