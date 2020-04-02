// BEGIN-SNIPPET quickstart-button-final.js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { statechart, matchesState } from 'ember-statecharts/computed';

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

  @or('isDisabled', 'isBusy', 'isInteractivityUnknown')
  showAsDisabled;

  @statechart(
    {
      type: 'parallel',
      states: {
        interactivity: {
          initial: 'unknown',
          states: {
            unknown: {
              on: {
                ENABLE: 'enabled',
                DISABLE: 'disabled',
              },
            },
            enabled: {
              on: {
                DISABLE: 'disabled',
              },
            },
            disabled: {
              on: {
                ENABLE: 'enabled',
              },
            },
          },
        },
        activity: {
          initial: 'idle',
          states: {
            idle: {
              on: {
                SUBMIT: {
                  target: 'busy',
                  cond: 'isEnabled',
                },
              },
            },
            busy: {
              entry: ['handleSubmit'],
              on: {
                SUCCESS: 'success',
                ERROR: 'error',
              },
            },
            success: {
              entry: ['handleSuccess'],
              on: {
                SUBMIT: {
                  target: 'busy',
                  cond: 'isEnabled',
                },
              },
            },
            error: {
              entry: ['handleError'],
              on: {
                SUBMIT: {
                  target: 'busy',
                  cond: 'isEnabled',
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        handleSubmit(context) {
          context.handleSubmitTask.perform();
        },
        handleSuccess(context) {
          context.onSuccess();
        },
        handleError(context) {
          context.onError();
        },
      },
      guards: {
        isEnabled(context) {
          return !context.isDisabled;
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
