/* eslint-disable */
export default // BEGIN-SNIPPET quickstart-on-exit.js
({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: 'busy',
      },
      exit: ['handleSubmit'],
    },
    busy: {},
  },
},
{
  actions: {
    handleSubmit(/*context, event*/) {
      // `context` will be the Ember.Object implementing the statechart
    },
  },
});
// END-SNIPPET
