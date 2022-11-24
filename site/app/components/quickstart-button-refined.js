// BEGIN-SNIPPET quickstart-button-final
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { useMachine } from 'ember-statecharts';
import quickstartButtonRefinedMachine from '../machines/quickstart-button-refined';

async function noop() {}

export default class QuickstartButtonFinal extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  get isBusy() {
    return this.statechart.state.matches({ activity: 'busy' });
  }

  get isDisabled() {
    return this.statechart.state.matches({ interactivity: 'disabled' });
  }

  get isInteractivityUnknown() {
    return this.statechart.state.matches({ interactivity: 'unknown' });
  }
  get showAsDisabled() {
    const { isDisabled, isBusy, isInteractivityUnknown } = this;

    return isDisabled || isBusy || isInteractivityUnknown;
  }

  statechart = useMachine(this, () => {
    const { onSuccess, onError, onClick } = this;
    const { disabled } = this.args;

    return {
      machine: quickstartButtonRefinedMachine
        .withContext({
          disabled,
        })
        .withConfig({
          actions: {
            handleSuccess: onSuccess,
            handleError: onError,
          },
          services: {
            handleSubmit: onClick,
          },
          guards: {
            isEnabled({ disabled }) {
              return !disabled;
            },
          },
        }),
      update: ({ send, machine: { context } }) => {
        const { disabled } = context;

        if (disabled) {
          send('DISABLE');
        } else {
          send('ENABLE');
        }
      },
    };
  });

  @action
  handleClick() {
    this.statechart.send('SUBMIT');
  }

  @action
  onSuccess(_context, { data: result }) {
    return this.args.onSuccess(result) || noop();
  }

  @action
  onError(_context, { data: error }) {
    return this.args.onError(error) || noop();
  }
}
// END-SNIPPET
