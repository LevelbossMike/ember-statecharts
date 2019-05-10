import Component from '@ember/component';
import layout from '../templates/components/es-statechart';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  statechartRegistry: service(),

  statechart: null,

  previewMode: false,

  service: readOnly('statechart.service'),

  machine: readOnly('service.machine'),

  guid: computed(function() {
    return guidFor(this);
  }),

  init() {
    this._super(...arguments);

    this.get('statechartRegistry').registerContainer(
      this.get('guid'),
      this.get('statechart'),
      this.get('previewMode')
    );
  },

  didReceiveAttrs() {
    this._super(...arguments);
  },
});
