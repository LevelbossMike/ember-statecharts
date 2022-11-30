import { createMachine } from 'xstate';

export const toggleConfig = {
  initial: 'off',
  states: {
    off: {
      on: {
        TOGGLE: 'on',
      },
    },
    on: {
      on: {
        TOGGLE: 'off',
      },
    },
  },
};

export default createMachine(toggleConfig);
