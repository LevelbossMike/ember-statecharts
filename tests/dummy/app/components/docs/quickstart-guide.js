import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

import { task, timeout } from 'ember-concurrency';

export default class extends Component {
  // BEGIN-SNIPPET quickstart-button-used.js

  // ...
  @tracked
  failRequest = false;

  @task(function* () {
    yield timeout(1000);

    if (this.get('failRequest')) {
      throw 'wat';
    }
  }).drop()
  submitTask;

  @action
  onSuccess() {
    window.alert('Submit successful');
  }

  @action
  onError() {
    window.alert('Submit failed');
  }
  // ...
  // END-SNIPPET
}
