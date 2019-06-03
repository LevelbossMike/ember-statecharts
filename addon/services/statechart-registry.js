import Service from '@ember/service';
import O, { computed, get, getProperties, setProperties } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';
import { interpret } from 'xstate';
import { inject as service } from '@ember/service';

const StatechartContainer = O.extend({
  statechart: null,
  // all transitions are followed when clicked
  previewMode: false,

  previewEdge: null,
  previewState: null,

  state: computed('statechart.currentState', {
    get() {
      return this.get('statechart.currentState');
    },
    set(key, value) {
      return value;
    },
  }),

  service: readOnly('statechart.service'),

  interpreter: computed('service', 'machine', 'previewMode', function() {
    const { service, machine, previewMode } = getProperties(this, [
      'service',
      'machine',
      'previewMode',
    ]);

    if (previewMode) {
      return this.interpretMachine(machine);
    }

    return service;
  }),

  onActionTriggered() {},

  interpretMachine(machine) {
    // parse machine actions // get actions from them and stub them out
    const actionNames = Object.keys(machine.options.actions || {});
    const guardNames = Object.keys(machine.options.guards);

    // guards will always return true if they are triggerd by their corresponding event button
    const stubbedGuards = guardNames.reduce((acc, name) => {
      acc[name] = (context, { cond }) => {
        if (cond && cond.name === name) {
          return true;
        }
      };
      return acc;
    }, {});

    const stubbedActions = actionNames.reduce((acc, name) => {
      acc[name] = this.onActionTriggered.bind(this, name);
      return acc;
    }, {});

    const interpreter = interpret(
      machine.withConfig({
        actions: stubbedActions,
        guards: stubbedGuards,
      })
    ).onTransition(nextState => {
      this.set('state', nextState);
    });

    return interpreter.start();
  },

  machine: readOnly('service.machine'),

  activeState: computed('state', 'machine', function() {
    const { state, machine } = getProperties(this, ['state', 'machine']);

    return machine.getStates(state.value);
  }),

  edges: computed(function() {
    return A();
  }),

  pushEdge(edge) {
    get(this, 'edges').pushObject(edge);
  },

  removeEdge(edge) {
    get(this, 'edges').removeObject(edge);
  },

  previewEdgeEvent(edge) {
    const { interpreter, machine } = getProperties(this, ['interpreter', 'machine']);

    const previewStateNodes = machine.getStates(interpreter.nextState(edge.event).value);

    setProperties(this, {
      previewEdge: edge,
      previewStateNode: edge.target,
      previewStateNodes,
    });
  },

  unpreviewEdgeEvent() {
    setProperties(this, {
      previewEdge: null,
      previewStateNode: null,
      previewStateNodes: null,
    });
  },

  handleEdgeClick(edge) {
    const { previewMode, interpreter, statechart } = getProperties(this, [
      'previewMode',
      'interpreter',
      'statechart',
    ]);

    if (previewMode) {
      const { event, cond } = edge;
      interpreter.send(event, { cond });
    } else {
      statechart.send(edge.event);
    }
  },
});

export default Service.extend({
  notifications: service(),

  containers: computed(function() {
    return {};
  }),

  registerContainer(guid, statechart, previewMode) {
    if (!this._containerForGuid(guid)) {
      this._setContainerContentForGuid(
        guid,
        StatechartContainer.create({
          statechart,
          previewMode,
          onActionTriggered: this._alertTriggeredAction.bind(this),
        })
      );
    }
  },

  deregisterContainer(guid) {
    const statechartContainer = this._containerForGuid(guid);
    if (statechartContainer) {
      this._setContainerContentForGuid(guid, null);

      statechartContainer.destroy();
    }
  },

  registerEdge(guid, edge) {
    const container = this._containerForGuid(guid);

    if (container) {
      container.pushEdge(edge);
    }
  },

  deregisterEdge(guid, edge) {
    const container = this._containerForGuid(guid);
    if (container) {
      container.removeEdge(edge);
    }
  },

  activateEdge(guid, edge) {
    const container = this._containerForGuid(guid);

    container.previewEdgeEvent(edge);
  },

  deactivateEdge(guid) {
    const container = this._containerForGuid(guid);

    container.unpreviewEdgeEvent();
  },

  handleEdgeClick(guid, edge) {
    const container = this._containerForGuid(guid);

    container.handleEdgeClick(edge);
  },

  _containerForGuid(guid) {
    return this.get(`containers.${guid}`);
  },

  _setContainerContentForGuid(guid, content) {
    this.set(`containers.${guid}`, content);
  },

  _alertTriggeredAction(actionName) {
    this.notifications.notify(`Triggered action named \`${actionName}\``);
  },
});
