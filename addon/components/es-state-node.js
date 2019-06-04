import Component from '@ember/component';
import layout from '../templates/components/es-state-node';
import { computed, getProperties } from '@ember/object';
import { not, readOnly, equal, gt } from '@ember/object/computed';
import { getEdges } from 'xstate/lib/graph';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';

function flatten(array) {
  return [].concat(...array);
}

export default Component.extend({
  layout,

  statechartRegistry: service(),

  tagName: '',

  stateNode: null,

  isTopLevel: false,

  collapseSubstates: false,

  hasSubstates: gt('stateNodes.length', 0),

  isInactive: not('isActive'),

  isNode: not('isTopLevel'),

  isParallel: equal('stateNode.type', 'parallel'),

  isPreviewed: computed('statechartContainer.previewStateNodes', 'stateNode', function() {
    const stateIds = this.get('stateNode').stateIds;

    const previewStateNodes = this.get('statechartContainer.previewStateNodes');

    const previewStateIds =
      (previewStateNodes && flatten(previewStateNodes.map(stateNode => stateNode.stateIds))) || [];

    return stateIds.filter(stateId => previewStateIds.indexOf(stateId) > -1).length > 0;
  }),

  isActive: computed('statechartContainer.activeState', 'stateNode', function() {
    const activeState = this.get('statechartContainer.activeState');
    const stateNode = this.get('stateNode');

    const stateIds = stateNode.stateIds;

    const activeStateIds =
      (activeState && flatten(activeState.map(stateNode => stateNode.stateIds))) || [];

    return stateIds.filter(stateId => activeStateIds.indexOf(stateId) > -1).length > 0;
  }),

  isInitialStateNode: computed('initialStateNodes', function() {
    const initialStateNodes = this.get('initialStateNodes');

    if (initialStateNodes) {
      return initialStateNodes.indexOf(this.stateNode) > -1;
    }
  }),

  onEntryActions: readOnly('stateNode.onEntry'),
  onExitActions: readOnly('stateNode.onExit'),

  guid: computed(function() {
    return guidFor(this);
  }),

  stateNodes: computed('stateNode', function() {
    const states = this.get('stateNode').states;

    if (!states) {
      return [];
    }

    const stateNodeNames = Object.keys(states);

    const stateNodes = stateNodeNames.map(name => states[name]);

    return stateNodes;
  }),

  // get the inital nodes of the parent and check if this statenode is included later on
  initialStateNodes: computed('stateNode', function() {
    const parent = this.get('stateNode.parent');

    if (parent) {
      return parent.initialStateNodes;
    }
  }),

  edges: computed('stateNode', function() {
    const stateNode = this.get('stateNode');

    const edges = getEdges(stateNode, { depth: 0 });

    return edges;
  }),

  actions: {
    // use a provider for this
    activateEdge(edge) {
      const { statechartRegistry, containerGuid } = getProperties(this, [
        'statechartRegistry',
        'containerGuid',
      ]);

      statechartRegistry.activateEdge(containerGuid, edge);
    },
    deactivateEdge(edge) {
      const { statechartRegistry, containerGuid } = getProperties(this, [
        'statechartRegistry',
        'containerGuid',
      ]);

      statechartRegistry.deactivateEdge(containerGuid, edge);
    },

    handleEdgeClick(edge) {
      const { statechartRegistry, containerGuid } = getProperties(this, [
        'statechartRegistry',
        'containerGuid',
      ]);

      statechartRegistry.handleEdgeClick(containerGuid, edge);
    },
  },
});
