import useMachine, {
  ConfigurableMachineDefinition,
  InterpreterUsable,
} from './usables/use-machine';

import {
  EventObject,
  matchesState as xstateMatchesState,
  StateSchema,
  StateValue,
  Typestate,
} from 'xstate';

/* eslint-disable @typescript-eslint/no-explicit-any */
function matchesState(
  state: StateValue,
  statechartPropertyName = 'statechart'
): any {
  return function () {
    return {
      get(this: any): boolean {
        const statechart = this[statechartPropertyName] as
          | { state: { value: StateValue } }
          | undefined;

        if (statechart) {
          return xstateMatchesState(state, statechart.state.value);
        } else {
          return false;
        }
      },
    };
  };
}

/**
 * No-op typecast function that turns what TypeScript believes to be a
 * ConfigurableMachineDefinition function into a InterpreterUsable.
 *
 * ```js
 * import { useMachine, interpreterFor } from 'ember-statecharts';
 *
 * class Foo extends EmberObject {
 *   @use statechart = useMachine(...) {
 *     // ...
 *   }
 *
 *   someMethod() {
 *     this.statechart.send('WAT'); // TypeError
 *     interpreterFor(this.statechart).send('WAT'); // ok!
 *   }
 * }
 * ```
 *
 * @param configurableMachineDefinition The ConfigurableMachineDefinition used
 * to initialize the `useMachine`-usable via `@use`
 *
 * Note that this is purely a typecast function.
 */
function interpreterFor<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
>(
  configurableMachineDefinition: ConfigurableMachineDefinition<
    TContext,
    TStateSchema,
    TEvent,
    TTypestate
  >
): InterpreterUsable<TContext, TStateSchema, TEvent> {
  return (configurableMachineDefinition as unknown) as InterpreterUsable<
    TContext,
    TStateSchema,
    TEvent,
    TTypestate
  >;
}

export { useMachine, matchesState, interpreterFor };
