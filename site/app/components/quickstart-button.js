// BEGIN-SNIPPET quickstart-button
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { useMachine } from 'ember-statecharts';

import quickstartButtonMachine from '../machines/quickstart-button';

async function noop() {}

export default class QuickstartButton extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  statechart = useMachine(this, () => {
    const { onClick, onSuccess, onError } = this;

    return {
      machine: quickstartButtonMachine.withConfig({
        actions: {
          handleSuccess: onSuccess,
          handleError: onError,
        },
        services: {
          handleSubmit: onClick,
        },
      }),
    };
  });

  get isBusy() {
    return this.statechart.state.matches('busy');
  }

  get isDisabled() {
    return this.isBusy || this.args.disabled;
  }

  @action handleClick() {
    this.statechart.send('SUBMIT');
  }

  @action onSuccess(_context, { data: result }) {
    return (this.args.onSuccess && this.args.onSuccess(result)) || noop();
  }

  @action onError(_context, { data: error }) {
    return (this.args.onError && this.args.onError(error)) || noop();
  }
}
// END-SNIPPET
