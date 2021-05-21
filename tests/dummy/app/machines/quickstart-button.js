// BEGIN-SNIPPET quickstart-button-machine
import { Machine } from 'xstate';

export default Machine(
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SUBMIT: 'busy',
        },
      },
      busy: {
        entry: ['handleSubmit'],
        on: {
          SUCCESS: 'success',
          ERROR: 'error',
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
      handleSubmit() {},
      handleSuccess() {},
      handleError() {},
    },
  }
);
// END-SNIPPET
