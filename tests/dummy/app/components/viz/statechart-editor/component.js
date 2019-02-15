import Component from '@ember/component';
import { computed } from '@ember/object';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { task, timeout } from 'ember-concurrency';
import { next } from '@ember/runloop';
import { Machine } from 'xstate';

export default Component.extend({
  tagName: '',

  value: computed(function() {
    // const machine = this.get('statechart.machine');

    // return JSON.stringify(assign({}, { initial: machine.config.initial, states: machine.config.states }), null, 2);
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
            type: 'busy'
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

          next(() => {
            this.statechart.send('completeRenderingNodes');
          });
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

  actions: {
    updateConfig(string) {
      this.get('statechart').send('type', { config: string });
    },
    visualizeActionTriggered(actionName) {
      console.log(`Triggered action : ${actionName}`);
    }
  }
});
