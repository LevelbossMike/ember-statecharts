// BEGIN-SNIPPET quickstart-button-final.js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { use } from 'ember-usable';
import { matchesState, useMachine } from 'ember-statecharts';
import quickstartButtonRefinedMachine from '../machines/quickstart-button-refined';

function noop() {}

export default class QuickstartButtonFinal extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  get onSuccess() {
    return this.args.onSuccess || noop;
  }

  get onError() {
    return this.args.onError || noop;
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

  @use statechart = useMachine(quickstartButtonRefinedMachine)
    .withContext({ component: this })
    .withConfig({
      actions: {
        handleSubmit({ component }) {
          component.handleSubmitTask.perform();
        },
        handleSuccess({ component }) {
          component.onSuccess();
        },
        handleError({ component }) {
          component.onError();
        },
      },
      guards: {
        isEnabled({ component }) {
          return !component.isDisabled;
        },
      },
    });

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
  handleDisabled(_element, [disabled]) {
    if (disabled) {
      this.statechart.send('DISABLE');
    } else {
      this.statechart.send('ENABLE');
    }
  }
}
// END-SNIPPET
