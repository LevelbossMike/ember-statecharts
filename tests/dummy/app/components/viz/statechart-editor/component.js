import Component from '@ember/component';
import { computed } from '@ember/object';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { task, timeout } from 'ember-concurrency';
import { Machine } from 'xstate';
import { inject as service } from '@ember/service';
import MusicPlayerExample from '../../../utils/music-player-example';

export default Component.extend({
  tagName: '',

  notifications: service(),

  value: computed(function() {
    return JSON.stringify(MusicPlayerExample, null, 2);
  }),

  canRenderEdges: matchesState({
    success: 'canRenderEdges'
  }),

  statechart: statechart(
    {
      initial: 'idle',
      states: {
        idle: {
          on: {
            type: 'busy'
          }
        },
        busy: {
          onEntry: ['interpretMachine'],
          on: {
            type: 'busy',
            resolve: 'success',
            reject: 'error'
          }
        },
        success: {
          onEntry: ['replaceMachine'],
          on: {
            type: 'busy',
          }
        },
        error: {
          on: {
            type: 'busy'
          }
        }
      }
    },
    {
      actions: {
        interpretMachine({ config }) {
          this.interpretMachineTask.perform(config);
        },
        replaceMachine({ machine }) {
          this.set('machine', machine);
        }
      }
    }
  ),

  interpretMachineTask: task(function* (config) {
    yield timeout(500);

    try {
      const createMachine = new Function("Machine", `return Machine(${config})`);
      const machine = yield createMachine(Machine);

      this.statechart.send('resolve', { machine });
    } catch(e) {
      this.statechart.send('reject');
    }
  }).restartable(),

  didInsertElement() {
    this._super(...arguments);

    if (this.value) {
      // because ember-ace won't fire an update on start
      this.statechart.send('type', { config: this.value });
    }
  },

  actions: {
    updateConfig(string) {
      // remember config for rerender
      this.set('_config', string);

      this.get('statechart').send('type', { config: string });
    },

    visualizeActionTriggered(actionName) {
      this.notifications.notify(`Triggered action : ${actionName}`);
    },

    redraw() {
      this.get('statechart').send('type', { config: this._config });
    }
  }
});
