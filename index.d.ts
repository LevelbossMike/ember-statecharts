import {
  StateMachine, State,
  MachineConfig,
  Interpreter, EventType, EventObject,
  InterpreterOptions
} from "xstate";

// NOTE: there is a lot of repetition here :(
// Repetition will be less when ember-statecharts _is_ TS?


// Private Types
// For building the Public Types?
// C = Context
// S = Schema
// E = Events
type WithConfigParams<C, S, E extends EventObject> = Parameters<StateMachine<C, S, E>['withConfig']>;
type WithContextParams<C, S, E extends EventObject> = Parameters< StateMachine<C, S, E>['withContext']>;
type Send<C, S, E extends EventObject> = Interpreter<C, S, E>['send'];

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
