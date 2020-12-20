import { createMachine, StateNode, Typestate } from 'xstate';

import type { EventObject, MachineConfig, StateSchema } from 'xstate';
import { Config } from './interpreter';
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
    withConfig: machine.withConfig,
    withContext: machine.withContext,
    withState: (state: Parameters<Interpreter<Context, Schema, Event>['start']>[0]) =>
      (config.initialState = state),
    onTransition: (fn: StateListener<Context, Event, Schema, Typestate<Context>>) =>
      (config.onTransition = fn),
  };
}
