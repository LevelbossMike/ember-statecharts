// BEGIN-SNIPPET quickstart-button-machine
import { createMachine } from 'xstate';

export default createMachine(
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SUBMIT: 'busy',
        },
      },
      busy: {
        invoke: {
          src: 'handleSubmit',
          onDone: 'success',
          onError: 'error',
        },
      },
      success: {
        entry: ['handleSuccess'],
        on: {
          SUBMIT: 'busy',
        },
      },
      error: {
        entry: ['handleError'],
        on: {
          SUBMIT: 'busy',
        },
      },
    },
  },
  {
    actions: {
      handleSuccess() {},
      handleError() {},
    },
    services: {
      handleSubmit: async () => {},
    },
  }
);
// END-SNIPPET
