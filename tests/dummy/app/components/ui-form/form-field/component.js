import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';
import { statechart, matchesState } from 'ember-statecharts/computed';

export default Component.extend({
  tagName: '',

  formObject: null,
  property: null,

  triggerFormChange() {},

  statechart: statechart({
    initial: 'idle',
    states: {
      idle: {
        on: {
          markUsed: 'used',
        },
      },
      used: {},
    },
  }),

  wasInteractedWith: matchesState('used'),
  showErrorMessage: or('wasInteractedWith', 'userDidSubmitForm'),

  guid: computed(function() {
    return guidFor(this);
  }),

  actions: {
    change(value) {
      this.formObject.set(this.property, value);

      this.triggerFormChange();
    },

    markUsed() {
      this.statechart.send('markUsed');
    },
  },
});
