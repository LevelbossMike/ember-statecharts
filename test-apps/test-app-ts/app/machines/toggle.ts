import { createMachine } from 'xstate';

export interface ToggleContext {}

export type ToggleEvent = { type: 'TOGGLE' };

export default createMachine<ToggleContext, ToggleEvent>({
  initial: 'off',
  states: {
    on: {
      on: {
        TOGGLE: 'off',
      },
    },
    off: {
      on: {
        TOGGLE: 'on',
      },
    },
  },
  predictableActionArguments: true,
});
