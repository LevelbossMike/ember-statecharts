import Component from '@ember/component';
import { computed } from '@ember/object';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { getEdges } from "xstate/lib/graph";
import { interpret } from 'xstate/lib/interpreter';
import { flatten } from '../../../utils/statecharts-tooling';

function initialStateNodes(stateNode) {
  var stateKeys = Object.keys(stateNode.states);
  return stateNode.initialStateNodes.concat(flatten(stateKeys.map(function (key) {
    var childStateNode = stateNode.states[key];

    if (childStateNode.type === "compound" || childStateNode.type === "parallel") {
      return initialStateNodes(stateNode.states[key]);
    }

    return [];
  })));
}

export default Component.extend({
  tagName: '',

  machine: null,

  canRenderStatechart: matchesState({
    machinePresent: 'success'
  }),

  statechart: statechart({
    initial: 'idle',
    states: {
      idle: {
        on: {
          machineUpdated: 'machinePresent'
        }
      },
      machinePresent: {
        initial: 'interpretingMachine',
        states: {
          interpretingMachine: {
            onEntry: ['interpretMachine'],
            on: {
              resolve: 'success',
              reject: 'error'
            }
          },
          success: {
            onEntry: ['replaceVizData'],
          },
          error: {
            onEntry: ['logError'],
          }
        },
        on: {
          machineUpdated: 'machinePresent'
        }
      }
    }
  }, {
    actions: {
      interpretMachine({ machine }) {
        // as all these getters can fail even with a machine from xstate
        // we need to fetch this from the statechart and can't use computeds
        // we simply can't assume just because we passed a machine that the
        // machine is a valid machine
        try {
          const interpreter = this.interpretMachine(machine);
          const initialStates = this.getInitialStates(machine);
          const edges = this.getEdges(machine);

          this.statechart.send('resolve', { interpreter, initialStates, edges });
        } catch(e) {
          this.statechart.send('reject', { error: e });
        }
      },
      replaceVizData({ interpreter, initialStates, edges }) {
        this.setProperties({
          interpreter, initialStates, edges
        });
      }
    },

    logError({ error }) {
      this.set('error', error);
    }
  }),

  activeState: computed('machine', 'currentState', function() {
    return this.machine.getStates(this.interpreter.state.value);
  }),

  previewState: computed('machine', 'previewStateValue', function() {
    if (!this.previewStateValue) {
      return null;
    }

    return this.machine.getStates(this.previewStateValue);
  }),

  machineStates: computed('machine', function() {
    const stateNames = Object.keys(this.machine.states);
    return stateNames.map(name => this.machine.states[name])
  }),

  onActionTriggered(/* actionName */) {},

  interpretMachine(machine) {
    // parse machine actions // get actions from them and stub them out
    const actionNames = Object.keys(machine.options.actions || {});

    const stubbedActions = actionNames.reduce((acc, name) => { 
      acc[name] = this.onActionTriggered.bind(this, name);
      return acc;
    }, {})

    const interpreter = interpret(this.machine.withConfig({
      actions: stubbedActions
    })).onTransition(nextState => {
      this.set('currentState', nextState);
    })

    return interpreter.start();
  },

  getEdges(machine) {
    const edges = getEdges(machine);
    return edges;
  },

  getInitialStates(machine) {
    return initialStateNodes(machine);
  },

  _passGuard({ cond, fn}) {
      const { machine } = this.interpreter;
      const guardsCloned = Object.assign({}, machine.options.guards);
      machine.options.guards[cond] = () => true;

      fn();

      machine.options.guards = guardsCloned;
  },

  _setPrevieStateValue(event) {
    const previewStateValue = this.interpreter.nextState(event).value;

    this.set('previewStateValue', previewStateValue);
  },

  _send(event) {
    this.interpreter.send(event);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    this.statechart.send('machineUpdated', { machine: this.machine });
  },
  actions: {
    followStateChartTransition({ event, cond }) {
      const fn = this._send.bind(this, event);

      this._passGuard({cond, fn})
    },

    setPreviewStateValue({ event, cond }) {
      const fn = this._setPrevieStateValue.bind(this, event);

      this._passGuard({ cond, fn });
    }
  },
});