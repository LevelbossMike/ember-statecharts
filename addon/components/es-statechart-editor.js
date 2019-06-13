import Component from '@ember/component';
import layout from '../templates/components/es-statechart-editor';
import { statechart, matchesState } from 'ember-statecharts/computed';
//  don't use ember-concurrency! handle manually to not bundle it as a dependency
import { task, timeout } from 'ember-concurrency';
import Statechart from 'ember-statecharts/utils/statechart';

export default Component.extend({
  layout,
  tagName: '',

  _statechart: null,

  canRenderEdges: matchesState({ changed: { drawing: 'drawn' } }),
  isBusy: matchesState({ changed: { interpreter: 'busy' } }),
  isError: matchesState({ changed: { interpreter: 'error' } }),

  statechart: statechart(
    {
      initial: 'idle',
      states: {
        idle: {
          on: {
            INIT: 'changed',
          },
        },
        changed: {
          type: 'parallel',

          states: {
            drawing: {
              initial: 'undrawn',
              states: {
                undrawn: {
                  on: {
                    RESOLVE: 'drawn',
                  },
                },
                drawn: {
                  onEntry: ['replaceStatechart'],
                  on: {
                    RESOLVE: {
                      target: 'drawn',
                      // this is most likely a bug in xstate with parallel states
                      // on entry should be enough
                      actions: ['replaceStatechart'],
                    },
                  },
                },
              },
            },
            interpreter: {
              initial: 'busy',
              states: {
                busy: {
                  onEntry: ['interpretMachine'],
                  on: {
                    TYPE: 'busy',
                    RESOLVE: 'success',
                    REJECT: 'error',
                  },
                },
                success: {
                  on: {
                    TYPE: 'busy',
                  },
                },
                error: {
                  on: {
                    TYPE: 'busy',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        interpretMachine(context, { config, debounce = true }) {
          context.interpretMachineTask.perform(config, debounce);
        },
        replaceStatechart(context, { statechart }) {
          context.set('_statechart', statechart);
        },
      },
    }
  ),

  interpretMachineTask: task(function*(config, debounce) {
    if (debounce) {
      yield timeout(500);
    }

    try {
      const createStatechart = new Function('Statechart', `return new Statechart(${config})`);
      const statechart = yield createStatechart(Statechart);

      this.statechart.send('RESOLVE', { statechart });
    } catch (e) {
      this.statechart.send('REJECT');
    }
  }).restartable(),

  didInsertElement() {
    this._super(...arguments);

    if (this.value) {
      // because ember-ace won't fire an update on start
      this.statechart.send('INIT', { config: this.value, debounce: false });
    }
  },

  actions: {
    updateConfig(string) {
      this.get('statechart').send('TYPE', { config: string });
    },

    redraw() {
      this.get('statechart').send('TYPE', { config: this._config });
    },
  },
});
