import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class extends Component {
  @tracked
  failRequest = false;

  @tracked
  disabled = false;

  // BEGIN-SNIPPET quickstart-button-final-used

  // ...

  @(task(function* () {
    yield timeout(1000);

    if (this.failRequest) {
      throw 'wat';
    }
  }).drop())
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
