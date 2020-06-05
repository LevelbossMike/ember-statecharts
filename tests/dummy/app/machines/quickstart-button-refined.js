// BEGIN-SNIPPET quickstart-button-machine-refined.js
import { Machine } from 'xstate';

export default Machine(
  {
    type: 'parallel',
    states: {
      interactivity: {
        initial: 'unknown',
        states: {
          unknown: {
            on: {
              ENABLE: 'enabled',
              DISABLE: 'disabled',
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
            on: {
              SUCCESS: 'success',
              ERROR: 'error',
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
      handleSubmit(context) {
        context.handleSubmitTask.perform();
      },
      handleSuccess(context) {
        context.onSuccess();
      },
      handleError(context) {
        context.onError();
      },
    },
    guards: {
      isEnabled(context) {
        return !context.isDisabled;
      },
    },
  }
);
// END-SNIPPET
