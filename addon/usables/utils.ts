import { createMachine, StateNode, Typestate } from 'xstate';

import type { EventObject, MachineConfig, StateSchema } from 'xstate';
import { Config, UpdateFunction } from './interpreter';
import { Interpreter, StateListener } from 'xstate/lib/interpreter';

export function useMachine<Context, Schema extends StateSchema, Event extends EventObject>(
  machineOrStatechart: MachineConfig<Context, Schema, Event> | StateNode<Context, Schema, Event>
) {
  const machine =
    machineOrStatechart instanceof StateNode
      ? machineOrStatechart
      : createMachine(machineOrStatechart);

  const config: Config<Context, Schema, Event> = {};

  return {
    named: {
      machine,
      config,
    },
    // Machine setup hooks
    withConfig: machine.withConfig,
    withContext: machine.withContext,

    // withState is for the interpreter, which is configured later
    withState: (state: Parameters<Interpreter<Context, Schema, Event>['start']>[0]) =>
      (config.initialState = state),
    // onTransition gets set on the interpreter
    onTransition: (fn: StateListener<Context, Event, Schema, Typestate<Context>>) =>
      (config.onTransition = fn),
    // for handling tracked prop updates (ignoring them by default)
    update: (fn: UpdateFunction<Context, Schema, Event>) => (config.update = fn),
  };
}
