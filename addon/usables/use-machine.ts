import {
  interpret,
  createMachine,
  StateNode,
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
import { setUsableManager } from 'ember-usable';
import { later, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';
import { warn } from '@ember/debug';
import { StateListener } from 'xstate/lib/interpreter';

export const ARGS_STATE_CHANGE_WARNING =
  'A change to passed `args` or a local state change triggered an update to a `useMachine`-usable. You can send a dedicated event to the machine or restart it so this is handled. This is done via the `.update`-hook of the `useMachine`-usable.';

export type Send<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> = Interpreter<TContext, TStateSchema, TEvent, TTypestate>['send'];

export type UpdateFunction<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> = (args: {
  machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
  context?: TContext;
  config?: Partial<MachineOptions<TContext, TEvent>>;
  send: Send<TContext, TStateSchema, TEvent, TTypestate>;
  restart: (initialState?: State<TContext, TEvent, TStateSchema, TTypestate> | StateValue) => void;
}) => void;

export type UsableStatechart<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> =
  | MachineConfig<TContext, TStateSchema, TEvent>
  | StateMachine<TContext, TStateSchema, TEvent, TTypestate>;

export type InterpreterUsable<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> = {
  state: State<TContext, TEvent, TStateSchema, TTypestate>;
  send: Send<TContext, TStateSchema, TEvent, TTypestate>;
  service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
};

export type ConfigurableMachineDefinition<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
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

export type UseMachineBucket<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> = {
  interpreter: InterpreterService<TContext, TStateSchema, TEvent, TTypestate>;
  setupOptions?: {
    initialState: State<TContext, TEvent, TStateSchema, TTypestate> | StateValue;
  };
};

export class InterpreterService<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext>
> {
  @tracked service!: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  @tracked _state!: State<TContext, TEvent, TStateSchema, TTypestate>;

  machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
  interpreterOptions: Partial<InterpreterOptions>;
  onTransition: StateListener<TContext, TEvent, TStateSchema, TTypestate> | undefined = undefined;

  constructor(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>,
    interpreterOptions: Partial<InterpreterOptions>,
    onTransition?: StateListener<TContext, TEvent, TStateSchema, TTypestate>
  ) {
    this.machine = machine;
    this.interpreterOptions = interpreterOptions || {};
    this.onTransition = onTransition;
  }

  get state(): {
    state: State<TContext, TEvent, TStateSchema, TTypestate>;
    send: Send<TContext, TStateSchema, TEvent, TTypestate>;
    service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  } {
    return {
      state: this._state,
      send: this.service.send,
      service: this.service,
    };
  }

  setup(
    setupOptions: {
      initialState?: State<TContext, TEvent, TStateSchema, TTypestate> | StateValue;
    } = {}
  ): void {
    const { state } = this.interpreterOptions;

    this.service = interpret(this.machine, {
      devTools: DEBUG,
      ...this.interpreterOptions,
      clock: {
        setTimeout(fn, ms) {
          return later.call(null, fn, ms);
        },
        clearTimeout(timer) {
          return cancel.call(null, timer);
        },
      },
    }).onTransition((state) => {
      this._state = state;
    });

    if (this.onTransition) {
      this.service.onTransition(this.onTransition);
    }

    this.service.start(setupOptions.initialState || state);
  }

  teardown(): void {
    this.service.stop();
  }
}

export class MachineInterpreterManager<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> {
  createUsable(
    context: any,
    {
      machine,
      interpreterOptions,
      _onTransition,
    }: ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate>
  ): UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate> {
    const owner = getOwner(context);

    let onTransition;

    if (_onTransition) {
      onTransition = _onTransition.bind(context);
    }

    const interpreter = new InterpreterService(machine, interpreterOptions, onTransition);

    setOwner(interpreter, owner);

    return { interpreter };
  }

  getState({
    interpreter,
  }: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>): InterpreterService<
    TContext,
    TStateSchema,
    TEvent,
    TTypestate
  >['state'] {
    return interpreter.state;
  }

  setupUsable({
    interpreter,
    setupOptions,
  }: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>): void {
    interpreter.setup(setupOptions);
  }

  updateUsable(
    bucket: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>,
    configurableMachineDefinition: ConfigurableMachineDefinition<
      TContext,
      TStateSchema,
      TEvent,
      TTypestate
    >
  ): void {
    const { interpreter } = bucket;
    const { args, _update } = configurableMachineDefinition;

    if (_update) {
      const { machine, context, config } = args;
      _update({
        machine,
        context,
        config,
        send: interpreter.service.send,
        restart: this.restartUsable.bind(this, bucket, configurableMachineDefinition),
      });
    } else {
      warn(ARGS_STATE_CHANGE_WARNING, false, { id: 'statecharts.use-machine.args-state-change' });
    }
  }

  teardownUsable({
    interpreter,
  }: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>): void {
    interpreter.teardown();
  }

  restartUsable(
    bucket: UseMachineBucket<TContext, TStateSchema, TEvent, TTypestate>,
    configurableMachineDefinition: ConfigurableMachineDefinition<
      TContext,
      TStateSchema,
      TEvent,
      TTypestate
    >,
    state: State<TContext, TEvent, TStateSchema, TTypestate> | StateValue
  ): void {
    this.teardownUsable(bucket);
    bucket.interpreter = this.createUsable(bucket, configurableMachineDefinition).interpreter;
    bucket.setupOptions = { initialState: state };
    this.setupUsable(bucket);
  }
}

const createMachineInterpreterManager = () => {
  return new MachineInterpreterManager();
};

const MANAGED_INTERPRETER = {};
setUsableManager(MANAGED_INTERPRETER, createMachineInterpreterManager);

export default function useMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
>(
  machine: UsableStatechart<TContext, TStateSchema, TEvent, TTypestate>,
  interpreterOptions: Partial<InterpreterOptions> = {}
): ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate> {
  const configurableMachineDefinition = Object.create(
    MANAGED_INTERPRETER
  ) as ConfigurableMachineDefinition<TContext, TStateSchema, TEvent, TTypestate>;

  machine = machine instanceof StateNode ? machine : createMachine(machine);

  configurableMachineDefinition.machine = machine;
  configurableMachineDefinition.interpreterOptions = interpreterOptions;
  configurableMachineDefinition.args = {
    machine,
    interpreterOptions,
  };

  configurableMachineDefinition.update = function (fn) {
    configurableMachineDefinition._update = fn;
    return configurableMachineDefinition;
  };

  configurableMachineDefinition.onTransition = function (fn) {
    configurableMachineDefinition._onTransition = fn;
    return configurableMachineDefinition;
  };

  configurableMachineDefinition.withConfig = function (config) {
    configurableMachineDefinition.machine = configurableMachineDefinition.machine.withConfig(
      config
    );
    configurableMachineDefinition.args.machine = configurableMachineDefinition.machine;
    configurableMachineDefinition.args.config = config;
    return configurableMachineDefinition;
  };

  configurableMachineDefinition.withContext = function (context) {
    configurableMachineDefinition.machine = configurableMachineDefinition.machine.withContext(
      context
    ) as StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
    configurableMachineDefinition.args.machine = configurableMachineDefinition.machine;
    configurableMachineDefinition.args.context = context;
    return configurableMachineDefinition;
  };

  return configurableMachineDefinition;
}
