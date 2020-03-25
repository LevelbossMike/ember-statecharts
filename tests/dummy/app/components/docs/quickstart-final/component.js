import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  failRequest: false,

  disabled: false,

  onRegisterStatechart() {},

  // BEGIN-SNIPPET quickstart-button-final-used.js

  // ...

  submitTask: task(function*() {
    yield timeout(1000);

    if (this.get('failRequest')) {
      throw 'wat';
    }
  }).drop(),

  actions: {
    onSuccess() {
      window.alert('Submit successful');
    },
    onError() {
      window.alert('Submit failed');
    },

    // ...
    // END-SNIPPET
    registerStatechart(statechart) {
      this.onRegisterStatechart(statechart);
    },
  },
});
