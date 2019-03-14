// BEGIN-SNIPPET quickstart-button.js
import Component from '@ember/component';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  onClick() {},
  onSuccess() {},
  onError() {},

  isBusy: matchesState('busy'),

  statechart: statechart(
    {

      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: 'busy'
          }
        },
        busy: {
          onEntry: ['handleSubmit'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error'
          }
        },
        success: {
          onEntry: ['handleSuccess'],
          on: {
            SUBMIT: 'busy'
          }
        },
        error: {
          onEntry: ['handleError'],
          on: {
            SUBMIT: 'busy'
          }
        }
      }
    }, {
      actions: {
        handleSubmit() {
          this.handleSubmitTask.perform();
        },
        handleSuccess() {
          this.onSuccess();
        },
        handleError() {
          this.onError();
        }
      }
    }
  ),

  handleSubmitTask: task(function * () {
    try {
      const result = yield this.onClick();
      this.statechart.send('SUCCESS', { data: result });

    } catch(e) {
      this.statechart.send('ERROR');
    }
  }),

  actions: {
    buttonClicked() {
      this.statechart.send('SUBMIT');
    }
  }
});
// END-SNIPPET