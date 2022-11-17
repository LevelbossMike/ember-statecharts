/* eslint-disable */
export default // BEGIN-SNIPPET quickstart-on-exit
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
    handleSubmit(/*context, event*/) {},
  },
});
// END-SNIPPET
