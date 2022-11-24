import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

export default class extends Component {
  // BEGIN-SNIPPET quickstart-button-used

  // ...
  @tracked
  failRequest = false;

  doSomethingAsync = () => {
    const promise = new Promise((resolve, reject) => {
      const fn = this.failRequest ? reject : resolve;

      setTimeout(fn, 1000);
    });

    return promise;
  };

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
