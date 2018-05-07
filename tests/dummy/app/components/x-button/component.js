import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { equal } from '@ember/object/computed';
import StateChart from 'ember-statecharts/mixins/statechart';

export default Component.extend(StateChart, {
  tagName: 'button',

  onClick() {},

  attributeBindings: ['isBusy:disabled'],

  isBusy: equal('currentState.name', 'busy'),

  statechart: computed(function() {
    return {
      initialState: 'idle',

      states: {
        idle: {
          events: {
            click() {
              return this.goToState('busy');
            }
          }
        },
        disabled: {},
        busy: {
          enterState() {
            return this.context.onClick();
          }
        },
        success: {},
        error: {}
      }
    }
  }),

  click() {
    get(this, 'states').send('click');
  }
});
