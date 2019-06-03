import Component from '@ember/component';
import layout from '../templates/components/es-edge-provider';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  tagName: '',

  statechartRegistry: service(),

  // throw if this is not set!
  containerGuid: null,

  actions: {
    registerInitialEdge(registerEdge, stateNode) {
      const edge = {
        isInitialEdge: true,
        stateNode: stateNode,
      };

      registerEdge(edge);
    },

    deregisterInitialEdge(deregisterEdge, edges, stateNode) {
      if (edges) {
        const edge = edges.find(e => e.isInitialEdge && e.stateNode === stateNode);

        if (edge) {
          deregisterEdge(edge);
        }
      }
    },
  },
});
