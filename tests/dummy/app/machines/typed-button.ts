/* eslint-disable @typescript-eslint/no-empty-function */
// BEGIN-SNIPPET typed-button-machine.ts
import { createMachine } from 'xstate';

export interface ButtonContext {
  disabled?: boolean;
}

export type ButtonEvent =
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; result: any }
  | { type: 'ERROR'; error: any }
  | { type: 'ENABLE' }
  | { type: 'DISABLE' };

export type ButtonState =
  | { value: 'idle'; context: { disabled?: boolean } }
  | { value: 'busy'; context: { disabled?: boolean } }
  | { value: 'success'; context: { disabled?: boolean } }
  | { value: 'error'; context: { disabled?: boolean } };

export default createMachine<ButtonContext, ButtonEvent, ButtonState>(
  {
    type: 'parallel',
    states: {
      interactivity: {
        initial: 'unknown',
        states: {
          unknown: {
            on: {
              '': [{ target: 'enabled', cond: 'isEnabled' }, { target: 'disabled' }],
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
      handleSubmit() {},
      handleSuccess() {},
      handleError() {},
    },
    guards: {
      isEnabled(context) {
        return !context.disabled;
      },
    },
  }
);
// END-SNIPPET
