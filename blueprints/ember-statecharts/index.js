/* eslint-env node */
module.exports = {
  description: 'Add XState in the consumer app',

  normalizeEntityName() {},

  afterInstall() {
    return this.addPackagesToProject([{ name: 'xstate', target: '^4.12.0' }]);
  },
};
