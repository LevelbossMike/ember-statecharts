/* eslint-disable */
export default // BEGIN-SNIPPET quickstart-on-entry
({
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: 'busy',
      },
    },
    busy: {
      entry: ['handleSubmit'],
    },
  },
},
{
  actions: {
    handleSubmit(/*context, event*/) {},
  },
});
// END-SNIPPET
