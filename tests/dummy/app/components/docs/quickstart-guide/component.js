import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  notifications: service('es-notifications'),

  failRequest: false,

  onRegisterStatechart() {},

  // BEGIN-SNIPPET quickstart-button-used.js

  // ...

  submitTask: task(function*() {
    yield timeout(1000);

    if (this.get('failRequest')) {
      throw 'wat';
    }
  }).drop(),

  actions: {
    onSuccess() {
      this.notifications.notify('Submit successful');
    },
    onError() {
      this.notifications.notify('Submit failed');
    },

    // ...
    // END-SNIPPET
    registerStatechart(statechart) {
      this.onRegisterStatechart(statechart);
    },
  },
});
