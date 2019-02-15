import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, readOnly, or } from '@ember/object/computed';
import { relative } from '../../../utils/svg-tooling';

export default Component.extend({
  tagName: '',

  node: null,

  top: readOnly('nodeRect.top'),

  left: readOnly('nodeRect.left'),

  showAsActive: or('isActive', 'isPreviewed'),

  canDraw: and('top', 'left'),

  nodeRect: computed('node', function() {
    const { node, svg } = this;

    if (!node) { return; }

    const domElement = document.querySelector(`[data-state-node="${node.id}"`);

    return relative(
      domElement.getBoundingClientRect(),
      svg.getBoundingClientRect()
    );
  }),

  path: computed('nodeRect', function() {
    const { nodeRect } = this;

    if (!nodeRect) { return }

    const { top, left } = nodeRect;

    return "M " + (left - 10) + "," + top + " Q " + (left - 10) + "," + (top + 10) + " " + (left - 1) + "," + (top + 10) + " L " + left + "," + (top + 10);
  }),
  
  cx: computed('left', function() {
    return this.left - 10;
  }),

  isActive: computed('node', 'activeState', function() {
    if (!this.activeState) {
      return false;
    }

    return this.activeState.indexOf(this.node) > -1;
  }),

  isPreviewed: computed('node', 'previewState', function() {
    if (!this.previewState) {
      return false;
    }

    return this.previewState.indexOf(this.node) > -1;
  })
})