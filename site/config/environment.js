'use strict';

module.exports = function (environment) {
  const deployTarget = process.env.DEPLOY_TARGET || 'development';

  let ENV = {
    modulePrefix: 'site',
    deployTarget,
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    plausible: {
      src: 'https://analytics.effective-ember.com/js/plausible.js',
      domain: null,
    },
  };

  if (process.env.DEPLOY_TARGET) {
    const versionedDocInfo = require('../lib/versioned-doc-info');
    ENV.rootURL = versionedDocInfo(process.env.DEPLOY_TARGET).rootURL;
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.plausible.domain = 'ember-statecharts.com';
  }

  return ENV;
};
