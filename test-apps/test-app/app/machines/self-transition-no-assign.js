import { createMachine } from 'xstate';

export default createMachine({
  initial: 'active',

  states: {
    active: {
      on: {
        SELF: {},
      },
    },
  },
});
