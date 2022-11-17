/* eslint-env node */
'use strict';

module.exports = function (/* deployTarget */) {
  let ENV = {
    build: {},
    git: {
      commitMessage: 'chore: deploy %@',
    },
  };
  return ENV;
};
