import Component from '@ember/component';
import layout from '../templates/components/es-statechart-editor-error';
import fade from 'ember-animated/transitions/fade';

export default Component.extend({
  layout,

  tagName: '',

  transition: fade,
});
