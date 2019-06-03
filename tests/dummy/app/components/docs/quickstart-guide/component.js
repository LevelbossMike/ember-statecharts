import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  // BEGIN-SNIPPET quickstart-button-used.js

  // ...

  notifications: service(),

  submitTask: task(function*() {
    yield timeout(1000);
  }).drop(),

  actions: {
    onSuccess() {
      this.notifications.notify('Submit successful');
    },
    onError() {
      this.notifications.notify('Submit failed');
    },
  },
  // END-SNIPPET
});
