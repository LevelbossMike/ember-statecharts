// BEGIN-SNIPPET quickstart-button.js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { matchesState, useMachine } from 'ember-statecharts';
import { use } from 'ember-could-get-used-to-this';
import quickstartButtonMachine from '../machines/quickstart-button';

function noop() {}

export default class QuickstartButton extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  @use statechart = useMachine(quickstartButtonMachine).withConfig({
    actions: {
      handleSubmit: this.performSubmitTask,
      handleSuccess: this.onSuccess,
      handleError: this.onError,
    },
  });

  @matchesState('busy')
  isBusy;

  get isDisabled() {
    return this.isBusy || this.args.disabled;
  }

  @task(function* () {
    try {
      const result = yield this.onClick();
      this.statechart.send('SUCCESS', { result });
    } catch (e) {
      this.statechart.send('ERROR', { error: e });
    }
  })
  handleSubmitTask;

  @action
  handleClick() {
    this.statechart.send('SUBMIT');
  }

  @action
  onSuccess(_context, { result }) {
    return this.args.onSuccess(result) || noop();
  }

  @action
  onError(_context, { error }) {
    return this.args.onError(error) || noop();
  }

  @action
  performSubmitTask() {
    this.handleSubmitTask.perform();
  }
}
// END-SNIPPET
