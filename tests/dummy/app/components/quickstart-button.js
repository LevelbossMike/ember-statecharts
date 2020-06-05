// BEGIN-SNIPPET quickstart-button.js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { matchesState, useMachine } from 'ember-statecharts';
import { use } from 'ember-usable';
import quickstartButtonMachine from '../machines/quickstart-button';

function noop() {}

export default class QuickstartButton extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  get onSuccess() {
    return this.args.onSuccess || noop;
  }

  get onError() {
    return this.args.onError || noop;
  }

  @use statechart = useMachine(quickstartButtonMachine)
    .withContext({
      component: this,
    })
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
    });

  @matchesState('busy')
  isBusy;

  @or('isBusy', 'args.disabled')
  isDisabled;

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
}
// END-SNIPPET
