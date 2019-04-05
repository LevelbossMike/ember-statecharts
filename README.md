ember-statecharts [![Build Status](https://travis-ci.org/LevelbossMike/ember-statecharts.svg?branch=master)](https://travis-ci.org/LevelbossMike/ember-statecharts) [![Ember Observer Score](https://emberobserver.com/badges/ember-statecharts.svg)](https://emberobserver.com/addons/ember-statecharts)
==============================================================================

This addon provides a statechart abstraction for adding statecharts to your
`Ember.Object`s. Statecharts can be used to describe complex
behaviour of your objects and separate ui-concern from functional concerns in
your applications. This is especially useful in `Ember.Component`-architecture
but can be used across all layers of your application (e.g. when implementing
global application state).


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


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

<p align="center">
  <img width="435" alt="bildschirmfoto 2018-10-01 um 12 17 09" src="https://user-images.githubusercontent.com/242299/46283582-0fb27800-c575-11e8-8c8e-c132e9f8f77a.png">
</p>

And here's how you can model this behaviour with `ember-statecharts`:

```js
import Component from '@ember/component';
import { or } from '@ember/object/computed';
import { resolve } from 'rsvp';
import { statechart, matchesState } from 'ember-statecharts/computed';

export default Component.extend({
  tagName: 'button',

  onClick() {},
  onSuccess() {},
  onError() {},

  attributeBindings: ['isDisabled:disabled'],

  isDisabled: or('isBusy', 'isInDisabledState'),

  isBusy: matchesState('busy'),

  isInDisabledState: matchesState('disabled'),

  statechart: statechart({
    initial: 'idle',

    states: {
      idle: {
        on: {
          click: 'busy',
          disable: 'disabled',
        }
      },
      disabled: {
        on: {
          enable: 'idle'
        }
      },
      busy: {
        onEntry: ['executeOnClick'],
        on: {
          resolve: 'success',
          reject: 'error'
        }
      },
      success: {
        onEntry: ['handleSuccess'],
      },
      error: {
        onEntry: ['handleError'],
      }
    }
  }, {
    actions: {
      executeOnClick(/* data, context */) {
        // `this` references the object that includes the statechart
        return resolve()
          .then(() => this.onClick())
          .then(() => this.statechart.send('resolve'))
          .catch(() => this.statechart.send('reject'))
      },
      handleSuccess() {
        return this.onSuccess();
      },
      handleError() {
        return this.onError();
      }
    }
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.disabled) {
      this.statechart.send('disable');
    } else {
      this.statechart.send('enable');
    }
  },

  click() {
    return this.statechart.send('click');
  },
});
```

The important part being that you trigger behaviour only by sending events to
the `Object`'s `statechart`-property.

Inside of the `statechart`-configuration you have access to the whole power of
[xstate](https://github.com/davidkpiano/xstate). This means that you can
implement [guards](http://davidkpiano.github.io/xstate/docs/#/guides/guards),
[nested statecharts](http://davidkpiano.github.io/xstate/docs/#/guides/hierarchical) and [orthogonal
states](http://davidkpiano.github.io/xstate/docs/#/guides/parallel) in addition
to basic statecharts like shown in the example code.

Please refer to [xstate's excellent documentation](http://davidkpiano.github.io/xstate/docs/#/) until more docs are available for this addon.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
