import Component from '@ember/component';
import { computed } from '@ember/object';
import { flatten } from '../../../utils/statecharts-tooling';

export default Component.extend({
  tagName: '',

  // throw if this is not being set
  stateNode: null,

  activeState: null,
  previewState: null,

  onPreviewTransition() {},
  onUnpreviewTransition() {},
  onClickTransition() {},

  showStates: true,

  isParallel: computed('stateNode.type', function() {
    return this.stateNode.type === 'parallel';
  }),

  isActive: computed('activeState', 'stateNode', function() {
    const stateIds = this.stateNode.stateIds;

    const activeStateIds =
      (this.activeState && flatten(this.activeState.map(stateNode => stateNode.stateIds))) 
      || [];

    return stateIds.filter(stateId => activeStateIds.indexOf(stateId) > -1).length > 0;
  }),

  isPreview: computed('previewState', 'stateNode', function() {
    const stateIds = this.stateNode.stateIds;

    const previewStateIds =
      (this.previewState && flatten(this.previewState.map(stateNode => stateNode.stateIds))) 
      || [];

      return stateIds.filter(stateId => previewStateIds.indexOf(stateId) > -1).length > 0;
  }),

  states: computed(function() {
    const stateNames = Object.keys(this.stateNode.states);

    return stateNames.map(name => {
      return this.stateNode.states[name];
    });
  }),

  // we map transitions to make it easier to visualize events with guards
  // events with guards will display as two event handlers which display their
  // guard independently
  transitions: computed(function() {
    const { stateNode } = this;
    return flatten(stateNode.ownEvents.map(event => stateNode.definition.on[event]));
  }),

  onEntries: computed(function() {
    const { stateNode: { definition: { onEntry } } } = this;

    return onEntry.map(action => action);
  }),

  onExits: computed(function() {
    const { stateNode: { definition: { onExit } } } = this;

    return onExit.map(action => action);
  }),

  actions: {
    toggleStates() {
      this.toggleProperty('showStates');
    },

    setPreviewStateValue([transitionTargetKey]) {
      this.set('previewStateValue', transitionTargetKey);
    }
  }
})