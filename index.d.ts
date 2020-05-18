import {
  StateMachine, State,
  MachineConfig,
  Interpreter, EventType, EventObject,
  InterpreterOptions
} from "xstate";

// NOTE: there is a lot of repetition here :(
// Repetition will be less when ember-statecharts _is_ TS?

type WithConfigParams<Context, Schema, Events extends EventObject> = Parameters<StateMachine<Context, Schema, Events>['withConfig']>;
type WithContextParams<Context, Schema, Events extends EventObject> = Parameters< StateMachine<Context, Schema, Events>['withContext']>;
type Send<Context, Schema, Events extends EventObject> = Interpreter<Context, Schema, Events>['send'];

type InterpretedUsable<Context, Schema, Events extends EventObject> = {
  state: State<Context, Events>;
  send: Send<Context, Schema, Events>;
  service: Interpreter<Context, Schema, Events>;
  withConfig: (...args: WithConfigParams<Context, Schema, Events>) => InterpretedUsable<Context, Schema, Events>;
  withContext: (...args: WithContextParams<Context, Schema, Events>) => InterpretedUsable<Context, Schema, Events>;
}

type UsableStatechart<Context, Schema, Events extends EventObject> =
  | MachineConfig<Context, Schema, Events>
  | StateMachine<Context, Schema, Events>

export function useMachine<Context, Schema, Events extends EventObject>(
  machineConfig: UsableStatechart<Context, Schema, Events>,
  options?: Partial<InterpreterOptions>
): InterpretedUsable<Context, Schema, Events>;
