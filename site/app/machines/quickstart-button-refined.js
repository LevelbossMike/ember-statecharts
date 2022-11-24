// BEGIN-SNIPPET quickstart-button-machine-refined.js
import { createMachine } from 'xstate';

export default createMachine(
  {
    type: 'parallel',
    states: {
      interactivity: {
        initial: 'unknown',
        states: {
          unknown: {
            on: {
              '': [
                { target: 'enabled', cond: 'isEnabled' },
                { target: 'disabled' },
              ],
            },
          },
          enabled: {
            on: {
              DISABLE: 'disabled',
            },
          },
          disabled: {
            on: {
              ENABLE: 'enabled',
            },
          },
        },
      },
      activity: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              SUBMIT: {
                target: 'busy',
                cond: 'isEnabled',
              },
            },
          },
          busy: {
            entry: ['handleSubmit'],
            invoke: {
              src: 'handleSubmit',
              onDone: 'success',
              onError: 'error',
            },
          },
          success: {
            entry: ['handleSuccess'],
            on: {
              SUBMIT: {
                target: 'busy',
                cond: 'isEnabled',
              },
            },
          },
          error: {
            entry: ['handleError'],
            on: {
              SUBMIT: {
                target: 'busy',
                cond: 'isEnabled',
              },
            },
          },
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
    guards: {
      isEnabled(context) {
        return !context.disabled;
      },
    },
  }
);
// END-SNIPPET
