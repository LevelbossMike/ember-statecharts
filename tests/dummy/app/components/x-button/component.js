import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { equal, or } from '@ember/object/computed';
import StateChart from 'ember-statecharts/mixins/statechart';
import { resolve } from 'rsvp';

export default Component.extend(StateChart, {
  tagName: 'button',

  onClick() {},
  onSuccess() {},
  onError() {},

  attributeBindings: ['isDisabled:disabled'],

  isDisabled: or('isBusy', 'isInDisabledState'),

  isBusy: equal('currentState.name', 'busy'),
  isInDisabledState: equal('currentState.name', 'disabled'),

  statechart: computed('disabled', function() {
    let disabled = get(this, 'disabled');

    return {
      initialState: disabled ? 'disabled' : 'idle',

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
            return resolve()
              .then(this.context.onClick)
              .then(() => this.context.resolve())
              .catch(() => this.context.reject());
          },
          events: {
            resolve() {
              return this.goToState('success');
            },
            reject() {
              return this.goToState('error');
            }
          }
        },
        success: {
          enterState() {
            return this.context.onSuccess();
          }
        },
        error: {
          enterState() {
            return this.context.onError();
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
