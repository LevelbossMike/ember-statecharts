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
} from 'xstate';
import { TemplateArgs, Resource } from './resource';

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
    }): void;
    onTransition?(): void;
  };
}

class Statechart<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> extends Resource<StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>> {
  @tracked service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  @tracked state: State<TContext, TEvent, TStateSchema, TTypestate>;

  constructor(
    owner: Record<string, unknown>,
    args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>
  ) {
    super(owner, args);

    const machine = args.named.machine;

    const service = this._interpretMachine(machine);

    this.service = service;
    this.state = machine.initialState;
  }

  setup() {
    this._start();
  }

  // TODO: add restart and initial state!
  update(args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>) {
    const { named } = args;

    const { update, machine } = named;

    update && update({ machine, restart: this._restart.bind(this, machine) });
  }

  send(
    event: SingleOrArray<Event<TEvent>> | Event<TEvent>,
    payload?: EventData
  ) {
    this.service.send(event, payload);
  }

  _start(initialState?: State<TContext, TEvent, TStateSchema, TTypestate>) {
    // handleTransition
    this.service.start(initialState).onTransition((state) => {
      this.state = state;
    });
  }

  _interpretMachine(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>
  ) {
    const service = interpret(machine);

    return service;
  }

  _restart(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>,
    initialState?: State<TContext, TEvent, TStateSchema, TTypestate>
  ) {
    const { service } = this;

    const newService = this._interpretMachine(machine);

    service.stop();

    this.service = newService;

    this._start(initialState);
  }
}

export function useMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
>(
  context: Record<string, unknown>,
  computeArgs: () => {
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
    update?(opts: {
      machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>;
      restart(
        args: StatechartArgs<TContext, TStateSchema, TEvent, TTypestate>
      ): void;
    }): void;
    onTransition?(): void;
  }
) {
  return useResource(context, Statechart, () => {
    return {
      named: computeArgs(),
    };
  });
}
