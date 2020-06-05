# Working with statecharts

## `xstate`
Everything that `ember-statecharts` is doing is powered by the wonderful [`xstate`-library](https://xstate.js.org/). The [`xstate`-guides](https://xstate.js.org/docs/) provide extensive documentation about how to write statechart-configurations - please make use of this invaluable resource.

`ember-statecharts` is trying to provide a thin layer over `xstate`'s apis and
make it as easy as possible to use all of `xstate`'s functionality with
`Ember.js`. It makes sure your statecharts play nice with the Ember-runloop,
will wait for `xstate`-delays etc. when testing your applications and takes
care of cleaning up your statecharts when components get destroyed.

## Authoring `statechart`-configurations

To implement a statechart via `ember-statecharts` you will make use of the
`useMachine`- [usable](https://github.com/emberjs/rfcs/pull/567) exported from
`ember-statecharts`. `usable` support has yet to land in the framework so you
will need to make use of [ember-usable](https://github.com/pzuraq/ember-usable)
for now to use the `@use`-decorator - `ember-usable` will be installed for you
when you install `ember-statecharts`.

There are three ways to create a `statechart` with `useMachine`:

* use `useMachine` with an instance of an `xstate`-`Machine` - [Machine](https://xstate.js.org/docs/guides/machines.html#configuration)
* use `useMachine` with a valid `MachineConfig` - [MachineConfig](https://xstate.js.org/docs/guides/machines.html#configuration)
* use `useMachine` by using `xstate`'s - `createMachine` - [createMachine](https://xstate.js.org/docs/guides/typescript.html#typestates);

Here's an example that reflects the [nested statechart](https://xstate.js.org/docs/#hierarchical-nested-state-machines)-example from the [`xstate`-guides](https://xstate.js.org/docs/) in all three variants:

### `useMachine` with a `Machine`-instance

```js
import Component from '@glimmer/component';

import { Machine } from 'xstate';

import { use } from 'ember-usable';
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
  @use statechart = useMachine(machine)
}
```

### `useMachine` with a `MachineConfig`

```js
import Component from '@glimmer/component';

import { use } from 'ember-usable';
import { useMachine } from 'ember-statecharts';

export default class MyComponent extends Component {
  @use statechart = useMachine({
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
```

### `useMachine` with `createMachine`

```js
import Component from '@glimmer/component';

import { createMachine } from 'xstate';

import { use } from 'ember-usable';
import { useMachine } from 'ember-statecharts';

export default class MyComponent extends Component {
  @use statechart = createMachine({
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
export default class MyComponent extends Component {
  // ...

  @action
  buttonClicked() {
    this.buttonClickedTask.perform();
  }
}
```

to something like the following:

```js
import { Machine } from 'xstate';

const buttonMachine = Machine(
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
      handleSubmit(/* context, event */) {}
    }
  }
);

export default class MyComponent extends Component {
  // ...

  @use statechart = useMachine(buttonMachine)
    .withContext({
      component: this
    })
    .withConfig({
      handleSubmit(context) {
        const { component } = context;

        component.buttonClickedTask.perform();
      }
    })

  // ...

  @action
  buttonClicked() {
    this.statechart.send('SUBMIT');
  }
};
```

This might seem like an annoying level of indirection first but soon you will notice
that this indirection provides a safety net for your application behavior. Instead
of the burden of keeping track of the implicit states that your application can find itself in
in your head all the time you will model your behavior explicitly and let the statechart figure
out what needs to happen. In the above example users can't retrigger the 
`buttonClickedTask` when they trigger the `buttonClicked` repeatetly while the statechart
finds itself in the `busy` state for example.

### The statechart's context - using `withContext`

The Object that `@use`s the `useMachine`-usable will need to specify the
`context` of the statechart explicitly by using `withContext`. This makes sure
that you can design your behavior inside of `xstate`'s
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
      // `context` is set to whatever object we pass to `withContext`
      const { component } = context;

      context.buttonClickedTask.perform();
    }
  }
});

export default class MyComponent extends Component {
  // ...
  @use statechart = useMachine(buttonMachine)
    .withContext({
      component: this
    })

  @task(function*() {
    // ...
  })
  buttonClickedTask;

  @action
  buttonClicked() {
    this.statechart.send('SUBMIT');
  }
}
```

### Customizing the statechart's config - using `withConfig`

As with `withContext` the calling Object can also customize the statechart's
configuration by using `withConfig`. This makes sure that you can design your
behavior inside of `xstate`'s [visualizer](https://xstate.js.org/viz/) completely
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

  @use statechart = useMachine(submitMachine)
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
    handleSubmit(/* context, eventObject */) {}
  },
  guards: {
    allNecessaryDataIsAvailable(/* context, eventObject */) {}
  }
});

export default class MyComponent extends Component {
  @use statechart = useMachine(submitMachine)
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
of the `matchesState`-decorator. This means that when you want to for
example display a button component differently based on the state it finds
itself in this is very easy to do with `ember-statecharts`:

```js
import { use } from 'ember-usable';
import { matchesState, useMachine} from 'ember-statecharts';

export default class MyComponent extends Component {
  // ...
  @use statechart = useMachine({
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
  });

  @matchesState('error')
  didError;
}
```

```hbs
<button class={{if this.didError "btn btn__error" "btn"}}>
  Click me
</button>
```

You can pass a [`StateValue`](https://xstate.js.org/api/globals.html#statevalue) or
an array of `StateValue`s to `matchesState`. This means you can also match
against nested or [parallel](https://xstate.js.org/docs/guides/parallel.html)
states:

```js
// atomic state node
@matchesState('idle')

// nested state
@matchesState({ error: 'apiError' })

// parallel state
@matchesState({
  validity: 'invalid',
  interaction: {
    changed: 'fieldBlurred'
  }
})

// matching multiple states
@matchesState(['invalid', { error: 'remoteValidationError' }])
```

## Visualizing statecharts

To visualize your statecharts you can use the [xstate visualizer](https://xstate.js.org/viz/).

## Further reading

`xstate` comes with a comprehensive [documentation page](https://xstate.js.org/docs/) - it goes into great detail about what things you can do in `statechecart`-configurations.

Writing statecharts configurations is very easy once you are used to the syntax but feel free to consult the [`xstate`-guides](https://xstate.js.org/docs/) as often as necessary to get the hang of it.
