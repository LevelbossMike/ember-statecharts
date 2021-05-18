/* eslint-disable */
export default // BEGIN-SNIPPET quickstart-transition
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
    handleSubmit(/*context, event*/) {},
  },
});
// END-SNIPPET
