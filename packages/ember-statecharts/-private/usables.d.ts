import type {
  Interpreter,
  StateSchema,
  EventObject,
  Typestate,
  StateMachine,
  State,
  SingleOrArray,
  Event,
  EventData,
  InterpreterOptions,
} from 'xstate';
import { TemplateArgs, Resource } from './resource';
export declare const ARGS_STATE_CHANGE_WARNING =
  'A change to passed `args` or a local state change triggered an update to a `useMachine`-usable. You can send a dedicated event to the machine or restart it so this is handled. This is done via the `.update`-hook of the `useMachine`-usable.';
interface StatechartArgs<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> extends TemplateArgs {
  named: {
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
    update?(opts: {
      machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
      restart(
        args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>
      ): void;
      send(
        event: SingleOrArray<Event<TEvent>> | Event<TEvent>,
        payload?: EventData
      ): void;
    }): void;
    onTransition?(): void;
    interpreterOptions?: InterpreterOptions;
    initialState?: State<TContext, TEvent, TStateSchema, TTypestate>;
  };
}
export declare class Statechart<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> extends Resource<StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>> {
  service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  state: State<TContext, TEvent, TStateSchema, TTypestate>;
  services: Interpreter<TContext, TStateSchema, TEvent, TTypestate>[];
  constructor(
    owner: Record<string, unknown>,
    args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>
  );
  setup(): void;
  update(
    args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>
  ): void;
  teardown(): void;
  send(
    event: SingleOrArray<Event<TEvent>> | Event<TEvent>,
    payload?: EventData
  ): void;
  _start(
    initialState?: State<TContext, TEvent, TStateSchema, TTypestate>
  ): void;
  _interpretMachine(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>,
    opts?: InterpreterOptions
  ): Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  _restart(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>,
    initialState?: State<TContext, TEvent, TStateSchema, TTypestate>
  ): void;
  _stopOldService(): void;
  _rememberInterpretedService(
    service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>
  ): void;
}
export declare function useMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
>(
  context: object,
  computeArgs: () => {
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
    update?(opts: {
      machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
      restart(
        args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>
      ): void;
      send(
        event: SingleOrArray<Event<TEvent>> | Event<TEvent>,
        payload?: EventData
      ): void;
    }): void;
    onTransition?(): void;
    interpreterOptions?: InterpreterOptions;
    initialState?: State<TContext, TEvent, TStateSchema, TTypestate>;
  }
): Statechart<TContext, TStateSchema, TEvent, TTypestate>;
export {};
