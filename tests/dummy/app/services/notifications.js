import Service from '@ember/service';
import { A } from '@ember/array';
import O from '@ember/object';
import { timeout, task } from 'ember-concurrency';

const NOTIFICATION_DURATION = 2000;

export default Service.extend({
  notifications: null,

  init() {
    this._super(...arguments);

    this.notifications = A();
  },

  notify(message) {
    this.notificationTask.perform(message);
  },

  notificationTask: task(function*(message) {
    const notification = O.create({ message });
    this.notifications.pushObject(notification);

    yield timeout(NOTIFICATION_DURATION);

    this.notifications.removeObject(notification);
  }),
});
