import Component from '@glimmer/component';
import { action } from '@ember/object';
import { or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { statechart, matchesState } from 'ember-statecharts/computed';

function noop() {}

export default class XButton extends Component {
  get onClick() {
    return this.args.onClick || noop;
  }

  get onSuccess() {
    return this.args.onSuccess || noop;
  }

  get onError() {
    return this.args.onError || noop;
  }

  @matchesState('busy')
  isBusy;

  @or('isBusy', 'args.disabled')
  isDisabled;

  @statechart(
    {
      initial: 'idle',
      states: {
        idle: {
          on: {
            CLICK: 'busy',
          },
        },
        busy: {
          entry: ['handleClick'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
          },
        },
        success: {
          entry: ['handleSuccess'],
        },
        error: {
          entry: ['handleError'],
        },
      },
    },
    {
      actions: {
        handleClick(context) {
          context.handleClickTask.perform();
        },
        handleSuccess(context) {
          context.onSuccess();
        },
        handleError(context) {
          context.onError();
        },
      },
    }
  )
  statechart;

  @task(function* () {
    try {
      const result = yield this.onClick();
      this.statechart.send('SUCCESS', { result });
    } catch (e) {
      this.statechart.send('ERROR', { error: e });
    }
  })
  handleClickTask;

  @action
  handleClick() {
    this.statechart.send('CLICK');
  }
}
