// BEGIN-SNIPPET quickstart-button-final
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { matchesState } from 'ember-statecharts';
import { useMachine } from 'ember-statecharts/-private/usables';
import quickstartButtonRefinedMachine from '../machines/quickstart-button-refined';

function noop() {}

export default class QuickstartButtonFinal extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  @matchesState({ activity: 'busy' })
  isBusy;

  @matchesState({ interactivity: 'disabled' })
  isDisabled;

  @matchesState({ interactivity: 'unknown' })
  isInteractivityUnknown;

  get showAsDisabled() {
    const { isDisabled, isBusy, isInteractivityUnknown } = this;

    return isDisabled || isBusy || isInteractivityUnknown;
  }

  statechart = useMachine(this, () => {
    return {
      machine: quickstartButtonRefinedMachine
        .withContext({
          disabled: this.args.disabled,
        })
        .withConfig({
          actions: {
            handleSubmit: this.performSubmitTask,
            handleSuccess: this.onSuccess,
            handleError: this.onError,
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
