// BEGIN-SNIPPET quickstart-button.js
import Component from '@ember/component';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  onClick() {},
  onSuccess() {},
  onError() {},
  onInit() {},

  isBusy: matchesState('busy'),

  statechart: statechart(
    {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: 'busy',
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
            SUBMIT: 'busy',
          },
        },
        error: {
          onEntry: ['handleError'],
          on: {
            SUBMIT: 'busy',
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
    }
  ),

  // only here to display statechart externally
  init() {
    this._super(...arguments);
    this.onInit(this.get('statechart'));
  },

  handleSubmitTask: task(function*() {
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
