import Component from '@ember/component';
import layout from '../templates/components/es-edge';
import { get, getProperties, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  tagName: '',

  statechartRegistry: service(),

  edge: null,
  previewEdge: null,

  isActive: computed('previewEdge', 'edge', function() {
    return this.get('previewEdge') === this.get('edge');
  }),

  startElementSelector: computed('edge.{source,cond,event,isInitalEdge}', function() {
    const edge = get(this, 'edge');
    const containerGuid = get(this, 'containerGuid');
    const { source, cond, event, isInitialEdge, stateNode } = getProperties(edge, [
      'source',
      'cond',
      'event',
      'isInitialEdge',
      'stateNode',
    ]);

    if (isInitialEdge) {
      return `[data-test-statechart-container="${containerGuid}"] [data-test-initial-state="${
        stateNode.id
      }"]`;
    }
    return `[data-test-statechart-container="${containerGuid}"] [data-test-state-node-id="${source.id}"] [data-test-edge="${event}-${(cond && cond.name) || ''}"]`;
  }),

  endElementSelector: computed('edge.{target,isInitialEdge,stateNode}', function() {
    const edge = get(this, 'edge');
    const containerGuid = get(this, 'containerGuid');
    const { target, isInitialEdge, stateNode } = getProperties(edge, [
      'target',
      'isInitialEdge',
      'stateNode',
    ]);

    if (isInitialEdge) {
      return `[data-test-statechart-container="${containerGuid}"] [data-test-state-node-id="${
        stateNode.id
      }"] [data-test-state-node-body]`;
    }

    if (target) {
      return `[data-test-statechart-container="${containerGuid}"] [data-test-state-node-id="${
        target.id
      }"] [data-test-state-node-body]`;
    }
  }),

  startElement: computed('startElementSelector', function() {
    return document.querySelector(this.get('startElementSelector'));
  }),

  endElement: computed('endElementSelector', function() {
    return document.querySelector(this.get('endElementSelector'));
  }),
});
