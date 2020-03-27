// BEGIN-SNIPPET quickstart-button-final.js
import Component from '@ember/component';
import { or } from '@ember/object/computed';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  onClick() {},
  onSuccess() {},
  onError() {},
  onInit() {},

  showAsDisabled: or('isDisabled', 'isBusy', 'isInteractivtyUnknown'),

  isDisabled: matchesState({ interactivity: 'disabled' }),
  isBusy: matchesState({ activity: 'busy' }),
  isInteractivityUnknown: matchesState({ interactivity: 'unknown' }),

  statechart: statechart(
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
              onEntry: ['handleSubmit'],
              on: {
                SUCCESS: 'success',
                ERROR: 'error',
              },
            },
            success: {
              onEntry: ['handleSuccess'],
              on: {
                SUBMIT: {
                  target: 'busy',
                  cond: 'isEnabled',
                },
              },
            },
            error: {
              onEntry: ['handleError'],
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
  ),

  // only here to display statechart externally
  init() {
    this._super(...arguments);
    this.onInit(this.get('statechart'));
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.disabled) {
      this.statechart.send('DISABLE');
    } else {
      this.statechart.send('ENABLE');
    }
  },

  handleSubmitTask: task(function* () {
    try {
      const result = yield this.onClick();
      this.statechart.send('SUCCESS', { data: result });
    } catch (e) {
      this.statechart.send('ERROR');
    }
  }),

  actions: {
    buttonClicked() {
      this.statechart.send('SUBMIT');
    },
  },
});
// END-SNIPPET
