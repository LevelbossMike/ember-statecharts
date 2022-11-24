// BEGIN-SNIPPET typed-button-machine
import { createMachine } from 'xstate';

export interface ButtonContext {
  disabled?: boolean;
}

export type ButtonEvent =
  | { type: 'SUBMIT' }
  | { type: 'done.invoke.handleSubmit'; data: any }
  | { type: 'error.platform.handleSubmit'; data: any }
  | { type: 'ENABLE' }
  | { type: 'DISABLE' };

export type ButtonState =
  | { value: { activity: 'idle' }; context: { disabled?: boolean } }
  | { value: { activity: 'busy' }; context: { disabled?: boolean } }
  | { value: { activity: 'success' }; context: { disabled?: boolean } }
  | { value: { activity: 'error' }; context: { disabled?: boolean } }
  | { value: { interactivity: 'disabled' }; context: { disabled?: boolean } }
  | { value: { interactivity: 'unknown' }; context: { disabled?: boolean } }
  | { value: { interactivity: 'enabled' }; context: { disabled?: boolean } };

export default createMachine<ButtonContext, ButtonEvent, ButtonState>(
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
    guards: {
      isEnabled(context) {
        return !context.disabled;
      },
    },
    services: {
      handleSubmit: async () => {
        return new Promise((resolve) => resolve);
      },
    },
  }
);
// END-SNIPPET
