import { createMachine, assign } from 'xstate';

export default createMachine({
  initial: 'active',

  context: {
    count: 0,
  },

  states: {
    active: {
      on: {
        SELF: {
          actions: [
            assign({
              count: (context) => context.count + 1,
            }),
          ],
        },
      },
    },
  },
});
