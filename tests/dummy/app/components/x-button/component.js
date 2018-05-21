import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { or } from '@ember/object/computed';
import StateChart from 'ember-statecharts/mixins/statechart';
import { resolve } from 'rsvp';
import { matchesState } from 'xstate';

export default Component.extend(StateChart, {
  tagName: 'button',

  onClick() {},
  onSuccess() {},
  onError() {},

  attributeBindings: ['isDisabled:disabled'],

  isDisabled: or('isBusy', 'isInDisabledState'),

  isBusy: computed('currentState', function() {
    let currentState = get(this, 'currentState.value')

    return matchesState('busy', currentState);
  }),

  isInDisabledState: computed('currentState', function() {
    let currentState = get(this, 'currentState.value');

    return matchesState('disabled', currentState);
  }),

  statechart: computed('disabled', function() {
    let disabled = get(this, 'disabled');

    return {
      initial: disabled ? 'disabled' : 'idle',

      states: {
        idle: {
          on: {
            click: 'busy'
          }
        },
        disabled: {},
        busy: {
          onEntry(data, context) {
            return resolve()
              .then(context.onClick)
              .then(() => context.resolve())
              .catch(() => context.reject());
          },
          on: {
            resolve: 'success',
            reject: 'error'
          }
        },
        success: {
          onEntry(data, context) {
            return context.onSuccess();
          }
        },
        error: {
          onEntry(data, context) {
            return context.onError();
          }
        }
      }
    }
  }),

  click() {
    get(this, 'states').send('click');
  },

  resolve() {
    get(this, 'states').send('resolve');
  },

  reject() {
    get(this, 'states').send('reject');
  }
});
