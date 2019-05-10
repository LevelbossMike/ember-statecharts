import Component from '@ember/component';
import layout from '../templates/components/es-statechart-registry-provider';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  tagName: '',

  statechartRegistry: service(),

  actions: {
    deregisterContainer(guid) {
      this.get('statechartRegistry').deregisterContainer(guid);
    },
    registerEdge(guid, edge) {
      this.get('statechartRegistry').registerEdge(guid, edge);
    },

    deregisterEdge(guid, edge) {
      this.get('statechartRegistry').deregisterEdge(guid, edge);
    },
  },
});
