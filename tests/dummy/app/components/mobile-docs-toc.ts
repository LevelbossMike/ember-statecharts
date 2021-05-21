import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MobileDocsToc extends Component {
  @tracked showToc = false;

  @action toggleToc(): void {
    this.showToc = !this.showToc;
  }
}
