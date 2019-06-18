/* eslint-disable */
export default // BEGIN-SNIPPET quickstart-on-entry.js
({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: 'busy',
      },
    },
    busy: {
      onEntry: ['handleSubmit'],
    },
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
