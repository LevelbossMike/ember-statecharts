import { useResource } from './use-resource';
import { tracked } from '@glimmer/tracking';
import { interpret } from 'xstate';
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
import { warn } from '@ember/debug';
import { next } from '@ember/runloop';

export const ARGS_STATE_CHANGE_WARNING =
  'A change to passed `args` or a local state change triggered an update to a `useMachine`-usable. You can send a dedicated event to the machine or restart it so this is handled. This is done via the `.update`-hook of the `useMachine`-usable.';

interface StatechartArgs<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
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

export class Statechart<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> extends Resource<StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>> {
  @tracked service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  @tracked state: State<TContext, TEvent, TStateSchema, TTypestate>;
  @tracked services: Interpreter<
    TContext,
    TStateSchema,
    TEvent,
    TTypestate
  >[] = [];

  constructor(
    owner: Record<string, unknown>,
    args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>
  ) {
    super(owner, args);

    const machine = args.named.machine;

    const service = this._interpretMachine(
      machine,
      args.named.interpreterOptions
    );

    this.service = service;
    this.state = machine.initialState;
  }

  setup() {
    const { initialState } = this.args.named;

    this._start(initialState);
  }

  update(args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>) {
    const { named } = args;

    const { update, machine } = named;
    const { _restart, send } = this;

    if (update) {
      update({
        machine,
        send: send.bind(this),
        restart: _restart.bind(this, machine),
      });
    } else {
      warn(ARGS_STATE_CHANGE_WARNING, false, {
        id: 'statecharts.use-machine.args-state-change',
      });
    }
  }

  teardown() {
    this.service.stop();
  }

  send(
    event: SingleOrArray<Event<TEvent>> | Event<TEvent>,
    payload?: EventData
  ) {
    this.service.send(event, payload);
  }

  _start(initialState?: State<TContext, TEvent, TStateSchema, TTypestate>) {
    this.service.start(initialState).onTransition((state) => {
      this.state = state;
    });

    if (this.args.named.onTransition) {
      this.service.onTransition(this.args.named.onTransition);
    }
  }

  _interpretMachine(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>,
    opts?: InterpreterOptions
  ) {
    const service = interpret(machine, opts);

    return service;
  }

  _restart(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>,
    initialState?: State<TContext, TEvent, TStateSchema, TTypestate>
  ) {
    const newService = this._interpretMachine(machine);

    this.service = newService;

    this._start(initialState || this.args.named.initialState);

    this._stopOldService();
  }

  _stopOldService() {
    const oldService = this.services[this.services.length - 2];

    if (oldService) {
      oldService.stop();
    }
  }

  _rememberInterpretedService(
    service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>
  ) {
    next(this, () => {
      this.services = [...this.services, service];
    });
  }
}

export function useMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
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
): Statechart<TContext, TStateSchema, TEvent, TTypestate> {
  return useResource(context, Statechart, () => {
    return {
      named: computeArgs(),
    };
  });
}
