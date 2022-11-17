import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class StatechartsController extends Controller {
  @tracked
  counterCount = 0;
  @tracked
  count = 0;

  @action
  updateCount({ target: { value } }) {
    this.count = value;
  }

  @action
  syncCounterCount() {
    this.counterCount = +this.count;
  }
}
