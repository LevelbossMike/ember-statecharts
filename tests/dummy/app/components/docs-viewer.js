import Component from '@ember/component';
import layout from 'ember-cli-addon-docs/components/docs-viewer/template';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  docsRoutes: service(),
  router: service(),

  classNames: 'docs-viewer docs-flex docs-flex1',
});
