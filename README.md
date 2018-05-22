ember-statecharts [![Build Status](https://travis-ci.org/LevelbossMike/ember-statecharts.svg?branch=master)](https://travis-ci.org/LevelbossMike/ember-statecharts)
==============================================================================

This addon provides a statechart abstraction for adding statecharts to your
`Ember.Object`s via a mixin. Statecharts can be used to describe complex
behaviour of your objects and separate ui-concern from functional concerns in
your applications. This is especially useful in `Ember.Component`-architecture
but can be used across all layers of your application (e.g. when implementing
global application state).

Installation
------------------------------------------------------------------------------

```
ember install ember-statecharts
```


Usage
------------------------------------------------------------------------------

Statecharts have been around for a long time and have been used to model
stateful, reactive system successfully. You can read about statecharts in the
original paper [Statecharts - A Visual Formalism for Complex
Systems](http://www.inf.ed.ac.uk/teaching/courses/seoc/2005_2006/resources/statecharts.pdf)
by David Harel.

With statecharts we finally have a good abstraction to discuss behaviour with
other stakeholders of our applications in addition to a design language that
visualizes this behaviour. After designing a statechart it's very straight
forward to implement for example a component that implements the desired
behaviour. Here's an example:

Imagine your designers come to you and ask you to implement a button component.
Easy? Here are the requirements for the button:

The button needs to show a text and needs to be clickable. That's it. We have
all been in this situation and told the designer that this is super easy and
will be done in no time.

Unfortunately it is very easy to forget about specific states that your
new created button can find itself in if you are not using a structured
approach to model your component states (i.e. by not using a statechart). It's
also very easy to mix concerns when implementing the button. UI concerns and
behavioural concerns (i.e. how something looks in contrast to how something
behaves).

Did you think about a loading state of the button for when the action this
button triggers does something async? Did you think about an error state for
this button? did you think about a success state? Statecharts make it super
obvious on how to implement behaviour like this - here's a statechart that
describes the behaviour of the button component:

![x-button-statechart](https://user-images.githubusercontent.com/242299/40376466-b388246e-5dee-11e8-8eb8-165956c3affb.png)
And here's how you can model this behaviour with `ember-statecharts`:

```js
export default Component.extend(StateChart, {
  tagName: 'button',

  onClick() {},

  attributeBindings: ['isBusy:disabled'],

  isBusy: equal('currentState.name', 'busy'),

  statechart: computed(function() {
    return {
      initial: 'idle',

      states: {
        idle: {
          on: {
            click: 'busy'
          },
          onExit(data, context) {
            // onExit will be called when a state is exited
          }
        },
        disabled: {},
        busy: {
          onEntry(_data, context) {
            // onEntry will be called when a state is entered
            return context.onClick();
          },
          on: {
            resolve: 'success',
            reject: 'error'
          }
        },
        success: {
          on: {
            activate: {
              idle: {
                // specify actions that will be triggered when `success`
                // transitions to `idle`. You can pass multiple actions
                // if you feel the need to do so
                actions: [
                  (data, context) => { /* ... */ },

                  // you can also pass strings as actions which will execute on
                  // the object that implements the statechart
                  'notifyActivation'
                ]
              }
            }
          }
        },
        error: {
          // ...
        }
      }
    }
  }),

  click() {
    // you can pass an object to send
    let data = {
      name: 'tomster'
    };

    get(this, 'states').send('click', data);
  },

  notifyActivation(/* data */) {
    // ...
  }
});
```

The important part being that you trigger behaviour only by sending events to
the `Object`'s states property.

Inside of the `statechart`-configuration you have access to the whole power of
[xstate](https://github.com/davidkpiano/xstate). This means that you can
implement [guards](http://davidkpiano.github.io/xstate/docs/#/guides/guards),
[nested statecharts](http://davidkpiano.github.io/xstate/docs/#/guides/hierarchical) and [orthogonal
states](http://davidkpiano.github.io/xstate/docs/#/guides/parallel) in addition
to basic statecharts like shown in the example code.

Please refer to [xstate's excellent documentation](http://davidkpiano.github.io/xstate/docs/#/) until more docs are available for this addon.

Contributing
------------------------------------------------------------------------------

### Installation

* for this repository
* `git clone git@github.com/[your-name]/ember-statecharts.git`
* `cd ember-statecharts`
* `yarn install`

### Linting

* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

TODOs
----------

- [ ] figure out a nice way to visualize states in your application
- [ ] provide a statechart component that can be included in styleguides

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
