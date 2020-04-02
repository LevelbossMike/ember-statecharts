ember-statecharts [![Build Status](https://travis-ci.org/LevelbossMike/ember-statecharts.svg?branch=master)](https://travis-ci.org/LevelbossMike/ember-statecharts) [![Ember Observer Score](https://emberobserver.com/badges/ember-statecharts.svg)](https://emberobserver.com/addons/ember-statecharts)
==============================================================================

This addon provides a statechart abstraction for adding statecharts to your
`Ember.Object`s. Statecharts can be used to describe complex
behaviour of your objects and separate ui-concern from functional concerns in
your applications. This is especially useful in `Ember.Component`-architecture
but can be used across all layers of your application (e.g. when implementing
global application state).

[View the docs here.](https://ember-statecharts.com)


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


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
  <img width="385" alt="button" src="https://user-images.githubusercontent.com/242299/78223877-1ea21f80-74b7-11ea-9ce0-fdd255e8e3e3.png">
</p>

In addition to their modeling capabilities Statecharts are executable and can be used to drive user experience behavior in your Ember.js applications:

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { statechart, matchesState } from 'ember-statecharts/computed';

function noop() {}

export default class QuickstartButton extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  get onSuccess() {
    return this.args.onSuccess || noop;
  }

  get onError() {
    return this.args.onError || noop;
  }

  @matchesState('busy')
  isBusy;

  @or('isBusy', 'args.disabled')
  isDisabled;

  @statechart(
    {
      initial: 'idle',
      states: {
        idle: {
          on: {
            CLICK: 'busy',
          },
        },
        busy: {
          entry: ['handleClick'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
          },
        },
        success: {
          entry: ['handleSuccess'],
          on: {
            CLICK: 'busy',
          },
        },
        error: {
          entry: ['handleError'],
          on: {
            CLICK: 'busy',
          },
        },
      },
    },
    {
      actions: {
        handleClick(context) {
          context.handleClickTask.perform();
        },
        handleSuccess(context) {
          context.onSuccess();
        },
        handleError(context) {
          context.onError();
        },
      },
    }
  )
  statechart;

  @task(function* () {
    try {
      const result = yield this.onClick();
      this.statechart.send('SUCCESS', { result });
    } catch (e) {
      this.statechart.send('ERROR', { error: e });
    }
  })
  handleClickTask;

  @action
  handleClick() {
    this.statechart.send('CLICK');
  }
}
```

Please refer to the [documentation page](http://ember-statecharts.com) for a detailed guide of how you can use statecharts to improve your Ember.js application architecture.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
