// BEGIN-SNIPPET quickstart-button
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { matchesState } from 'ember-statecharts';
import { useMachine } from 'ember-statecharts/-private/usables';

import quickstartButtonMachine from '../machines/quickstart-button';

function noop() {}

export default class QuickstartButton extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  statechart = useMachine(this, () => {
    const { performSubmitTask, onSuccess, onError } = this;

    return {
      machine: quickstartButtonMachine.withConfig({
        actions: {
          handleSubmit: performSubmitTask,
          handleSuccess: onSuccess,
          handleError: onError,
        },
      }),
    };
  });

  @matchesState('busy')
  isBusy;

  get isDisabled() {
    return this.isBusy || this.args.disabled;
  }

  handleSubmitTask = task(async () => {
    try {
      const result = await this.onClick();
      this.statechart.send('SUCCESS', { result });
    } catch (e) {
      this.statechart.send('ERROR', { error: e });
    }
  });

  @action
  handleClick() {
    this.statechart.send('SUBMIT');
  }

  @action
  onSuccess(_context, { result }) {
    return (this.args.onSuccess && this.args.onSuccess(result)) || noop();
  }

  @action
  onError(_context, { error }) {
    return (this.args.onError && this.args.onError(error)) || noop();
  }

  @action
  performSubmitTask() {
    this.handleSubmitTask.perform();
  }
}
// END-SNIPPET
