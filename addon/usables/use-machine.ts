import { DEBUG } from '@glimmer/env';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { cancel, later } from '@ember/runloop';

import { Resource } from 'ember-could-get-used-to-this';
import { interpret, StateNode } from 'xstate';

import type {
  EventObject,
  Interpreter as XStateInterpreter,
  State,
  StateMachine,
  StateSchema,
  Typestate,
} from 'xstate';
import type { StateListener } from 'xstate/lib/interpreter';

const INTERPRETER = Symbol('interpreter');
const CONFIG = Symbol('config');
const MACHINE = Symbol('machine');

const ERROR_CHART_MISSING = `A statechart was not passed`;

export type Config<Context, Schema extends StateSchema, Event extends EventObject> = {
  onTransition?: StateListener<Context, Event, Schema, Typestate<Context>>;
  initialState?: Parameters<XStateInterpreter<Context, Schema, Event>['start']>[0];
};

export type Args<Context, Schema extends StateSchema, Event extends EventObject> = {
  named?: {
    machine: StateNode<Context, Schema, Event>;
    config: Config<Context, Schema, Event>;
  };
};

type SendArgs<Context, Schema extends StateSchema, Event extends EventObject> = Parameters<
  XStateInterpreter<Context, Schema, Event>['send']
>;

export class Interpreter<
  Context,
  Schema extends StateSchema,
  Event extends EventObject
> extends Resource<Args<Context, Schema, Event>> {
  declare [MACHINE]: StateMachine<Context, Schema, Event>;
  declare [INTERPRETER]: XStateInterpreter<Context, Schema, Event>;

  @tracked state?: State<Context, Event>;

  /**
   * This is the return value of `new Statechart(() => ...)`
   */
  get value(): {
    state?: State<Context, Event>;
    send: Interpreter<Context, Schema, Event>['send'];
  } {
    if (!this[INTERPRETER]) {
      this._setupMachine();
    }

    return {
      // For TypeScript, this is tricky because this is what is accessible at the call site
      // but typescript thinks the context is the class instance.
      //
      // To remedy, each property has to also exist on the class body under the same name
      state: this.state,
      send: this.send,
    };
  }

  /**
   * Private
   */

  private get [CONFIG]() {
    return this.args.named?.config;
  }

  @action
  send(...args: SendArgs<Context, Schema, Event>) {
    return this[INTERPRETER].send(...args);
  }

  @action
  private _setupMachine() {
    this[INTERPRETER] = interpret(this[MACHINE], {
      devTools: DEBUG,
      clock: {
        setTimeout(fn, ms) {
          return later.call(null, fn, ms);
        },
        clearTimeout(timer) {
          return cancel.call(null, timer);
        },
      },
    }).onTransition((state) => {
      this.state = state;
    });

    this.onTransition(this[CONFIG]?.onTransition);

    this[INTERPRETER].start(this[CONFIG]?.initialState);
  }

  @action
  private onTransition(fn?: StateListener<Context, Event, Schema, Typestate<Context>>) {
    if (!this[INTERPRETER]) {
      this._setupMachine();
    }

    if (fn) {
      this[INTERPRETER].onTransition(fn);
    }

    return this;
  }

  /**
   * Lifecycle methods on Resource
   *
   */
  @action
  protected setup() {
    const machine = this.args.named?.machine;

    assert(ERROR_CHART_MISSING, machine);

    this[MACHINE] = machine;
  }

  protected teardown() {
    if (!this[INTERPRETER]) return;

    this[INTERPRETER].stop();
  }
}
