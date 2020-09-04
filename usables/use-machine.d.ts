import {
  EventObject,
  StateMachine,
  Typestate,
  MachineConfig,
  StateSchema,
  Interpreter,
  State,
  MachineOptions,
  StateValue,
  InterpreterOptions,
} from 'xstate';
import { StateListener } from 'xstate/lib/interpreter';
export declare const ARGS_STATE_CHANGE_WARNING =
  'A change to passed `args` or a local state change triggered an update to a `useMachine`-usable. You can send a dedicated event to the machine or restart it so this is handled. This is done via the `.update`-hook of the `useMachine`-usable.';
export declare type Send<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> = Interpreter<TContext, TStateSchema, TEvent, TTypestate>['send'];
export declare type UpdateFunction<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> = (args: {
  machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
  context?: TContext;
  config?: Partial<MachineOptions<TContext, TEvent>>;
  send: Send<TContext, TStateSchema, TEvent, TTypestate>;
  restart: (initialState?: State<TContext, TEvent, TStateSchema, TTypestate> | StateValue) => void;
}) => void;
export declare type UsableStatechart<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> =
  | MachineConfig<TContext, TStateSchema, TEvent>
  | StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
export declare type InterpreterUsable<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> = {
  state: State<TContext, TEvent, TStateSchema, TTypestate>;
  send: Send<TContext, TStateSchema, TEvent, TTypestate>;
  service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
};
export declare type ConfigurableMachineDefinition<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> = {
  machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
  interpreterOptions: Partial<InterpreterOptions>;
  args: {
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
    interpreterOptions: Partial<InterpreterOptions>;
    config?: Partial<MachineOptions<TContext, TEvent>>;
    context?: TContext;
  };
  update: (
    fn: UpdateFunction<TContext, TStateSchema, TEvent, TTypestate>
  ) => ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate>;
  onTransition: (
    fn: StateListener<TContext, TEvent, TStateSchema, TTypestate>
  ) => ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate>;
  withConfig: (
    config: Partial<MachineOptions<TContext, TEvent>>
  ) => ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate>;
  withContext: (
    context: TContext
  ) => ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate>;
  _update?: UpdateFunction<TContext, TStateSchema, TEvent, TTypestate>;
  _onTransition?: StateListener<TContext, TEvent, TStateSchema, TTypestate>;
};
export declare type UseMachineBucket<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> = {
  interpreter: InterpreterService<TContext, TStateSchema, TEvent, TTypestate>;
  setupOptions?: {
    initialState: State<TContext, TEvent, TStateSchema, TTypestate> | StateValue;
  };
};
export declare class InterpreterService<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext>
> {
  service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  _state: State<TContext, TEvent, TStateSchema, TTypestate>;
  machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
  interpreterOptions: Partial<InterpreterOptions>;
  onTransition: StateListener<TContext, TEvent, TStateSchema, TTypestate> | undefined;
  constructor(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>,
    interpreterOptions: Partial<InterpreterOptions>,
    onTransition?: StateListener<TContext, TEvent, TStateSchema, TTypestate>
  );
  get state(): {
    state: State<TContext, TEvent, TStateSchema, TTypestate>;
    send: Send<TContext, TStateSchema, TEvent, TTypestate>;
    service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  };
  setup(setupOptions?: {
    initialState?: State<TContext, TEvent, TStateSchema, TTypestate> | StateValue;
  }): void;
  teardown(): void;
}
export declare class MachineInterpreterManager<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
> {
  createUsable(
    context: unknown,
    {
      machine,
      interpreterOptions,
      _onTransition,
    }: ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate>
  ): UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>;
  getState({
    interpreter,
  }: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>): InterpreterService<
    TContext,
    TStateSchema,
    TEvent,
    TTypestate
  >['state'];
  setupUsable({
    interpreter,
    setupOptions,
  }: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>): void;
  updateUsable(
    bucket: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>,
    configurableMachineDefinition: ConfigurableMachineDefinition<
      TContext,
      TStateSchema,
      TEvent,
      TTypestate
    >
  ): void;
  teardownUsable({
    interpreter,
  }: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>): void;
  restartUsable(
    bucket: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>,
    configurableMachineDefinition: ConfigurableMachineDefinition<
      TContext,
      TStateSchema,
      TEvent,
      TTypestate
    >,
    state: State<TContext, TEvent, TStateSchema, TTypestate> | StateValue
  ): void;
}
export default function useMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
>(
  machine: UsableStatechart<TContext, TStateSchema, TEvent, TTypestate>,
  interpreterOptions?: Partial<InterpreterOptions>
): ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate>;
