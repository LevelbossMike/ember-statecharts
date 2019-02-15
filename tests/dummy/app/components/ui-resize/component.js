import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware';
import { timeout, task } from 'ember-concurrency';


export default Component.extend(ResizeAware, {
  classNames: ['docs-absolute', 'docs-pin'],

  onDidResize() {},

  timeout: 0,

  onDidResizeTask: task(function*() {
    yield timeout(this.timeout);

    this.onDidResize();
  }).restartable(),

  didResize() {
    this.onDidResizeTask.perform();
  },
});