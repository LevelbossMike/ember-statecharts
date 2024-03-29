// BEGIN-SNIPPET counter-machine
import { createMachine, assign } from 'xstate';

export default createMachine({
  id: 'counterMachine',
  initial: 'inactive',
  context: {
    count: 0,
  },
  on: {
    RESET_COUNT: {
      actions: [
        assign({
          count: (_context, { count }) => count,
        }),
      ],
    },
  },
  states: {
    inactive: {
      on: {
        ACTIVATE: 'active',
      },
    },
    active: {
      on: {
        DEACTIVATE: 'inactive',
        INCREMENT: {
          target: 'active',
          actions: [
            assign({
              count: (context) => context.count + 1,
            }),
          ],
        },
        DECREMENT: {
          target: 'active',
          actions: [
            assign({
              count: (context) => context.count - 1,
            }),
          ],
        },
      },
    },
  },
});
// END-SNIPPET
