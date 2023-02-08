import { createMachine } from 'xstate';

export default createMachine({
  initial: 'off',
  states: {
    off: {
      on: {
        TOGGLE: 'on',
      },
    },
    on: {
      after: {
        500: 'off',
      },
    },
  },
  predictableActionArguments: true,
});
