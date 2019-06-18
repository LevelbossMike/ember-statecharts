/* eslint-disable */
export default // BEGIN-SNIPPET quickstart-transition.js
({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: 'busy',
          actions: ['handleSubmit'],
        },
      },
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
