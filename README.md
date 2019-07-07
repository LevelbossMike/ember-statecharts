ember-statecharts [![Build Status](https://travis-ci.org/LevelbossMike/ember-statecharts.svg?branch=master)](https://travis-ci.org/LevelbossMike/ember-statecharts) [![Ember Observer Score](https://emberobserver.com/badges/ember-statecharts.svg)](https://emberobserver.com/addons/ember-statecharts)
==============================================================================

This addon provides a statechart abstraction for adding statecharts to your
`Ember.Object`s. Statecharts can be used to describe complex
behaviour of your objects and separate ui-concern from functional concerns in
your applications. This is especially useful in `Ember.Component`-architecture
but can be used across all layers of your application (e.g. when implementing
global application state).

[View the docs here.](https://www.ember-statecharts.com)


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


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

With statecharts we finally have a good abstraction to model and discuss behaviour with
other stakeholders of our applications in addition to a design language that
visualizes this behaviour. Here's an example of a button component:

<p align="center">
  <img width="435" alt="bildschirmfoto 2018-10-01 um 12 17 09" src="https://user-images.githubusercontent.com/242299/46283582-0fb27800-c575-11e8-8c8e-c132e9f8f77a.png">
</p>

In addition to their modeling capabilities Statecharts are executable and can be used to drive user experience behavior in your Ember.js applications:

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
      executeOnClick(/*context, { eventObject } */) {
        // `context` references the object that includes the statechart
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

Please refer to [documentation page](http://www.ember-statecharts.com) for a detailed guide of how you can use statecharts to improve your Ember.js application architecture.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
