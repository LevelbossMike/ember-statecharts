import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class StatechartsController extends Controller {
  counterCount = 0;
  count = 0;

  @action
  updateCount({ target: { value } }) {
    this.set('count', value);
  }

  @action
  syncCounterCount() {
    this.set('counterCount', +this.count);
  }
}
