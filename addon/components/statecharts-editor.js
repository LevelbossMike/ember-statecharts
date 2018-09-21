import Component from '@ember/component';
import layout from '../templates/components/statecharts-editor';
import { computed, get } from '@ember/object';
import Statechart from 'ember-statecharts/mixins/statechart';
import { timeout, task } from 'ember-concurrency';
import { Machine } from 'xstate';
import Evented, { on } from '@ember/object/evented';

export default Component.extend(Statechart, Evented, {
  layout,

  statechart: computed(function() {
    return {
      initial: 'init',
      states: {
        init: {
          on: {
            init: {
              idle: {
                cond: (_context, { data }) => {
                  let { json } = data;
                  return !json;
                }
              },
              updating: {
                cond: (_context, { data }) => {
                  let { json } = data;
                  return !!json;
                }
              }
            },
          }
        },
        idle: {
          on: {
            'change': 'updating'
          }
        },
        updating: {
          onEntry: ['_updateConfig'],
          on: {
            configInvalid: 'error',
            change: 'changed',
            success: {
              idle: {
                actions: ['_updateVisualization']
              }
            }
          }
        },
        error: {
          onEntry: ['_show']
        }
      }
    };
  }),

  didInsertElement() {
    this._super(...arguments);

    const json = get(this, 'json');

    this.get('states').send('init', { json });
  },

  json: computed(function() {
    return {
      initial: 'playerOn',
      states: {
        playerOn: {
        },
        playerOff: {}
      }
    }
  }),

  updateConfigTask: task(function*(json) {
    yield timeout(500);

    const machine = yield Machine(json);

    return machine;
  }).restartable().evented(),

  // eslint-disable-next-line ember/no-on-calls-in-components
  updateConfigTaskSucces: on('updateConfigTask:succeeded', function({ value: machine }) {
    this.get('states').send('success', { machine });
  }),

  // eslint-disable-next-line ember/no-on-calls-in-components
  updateConfigTaskError: on('updateConfigTask:errored', function() {
    this.get('states').send('configInvalid');
  }),

  _updateConfig({ json }) {
    get(this, 'updateConfigTask').perform(json);
  },

  _updateVisualization({ machine }) {
    this.set('machine', machine);
  },

  actions: {
    updateConfig(json) {
      return this.get('states').send('change', { json });
    }
  }
});
