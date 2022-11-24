import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @tracked
  failRequest = false;

  @tracked
  disabled = false;

  // BEGIN-SNIPPET quickstart-button-final-used

  // ...

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
