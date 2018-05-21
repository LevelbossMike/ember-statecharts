'use strict';

module.exports = {
  name: 'ember-statecharts',

  included(app) {
    this._super.included.apply(this, arguments);

    app.import('node_modules/xstate/dist/xstate.js', {
      using: [
        { transformation: 'amd', as: 'xstate' }
      ]
    });
  }
};
