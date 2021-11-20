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

/**
 * A decorator that can be used to create a getter that matches against an
 * {@link InterpreterUsable}'s state and will return either `true` or `false`
 *
 *
 * ```js
 * import Component from '@glimmer/component';
 * import buttonMachine from '../machines/button';
 *
 * export default class Button extends Component {
 *  @use statechart = useMachine(buttonMachine)
 *
 *  @matchesState('disabled')
 *  isDisabled; // true when statechart is in `disabled` state
 *
 *  @matchesState({ interactivity: 'disabled' })
 *  isDisabled; // it is possible to match against nested/parallel states
 * }
 * ```
 *
 * You can match against any XState [StateValue](https://xstate.js.org/api/globals.html#statevalue)
 *
 * By default `matchesState` expects your {@link InterpreterUsable} to be called `statechart`.
 * If you named it differently you can use the second param to this decorator:
 *
 *
 * ```js
 * import Component from '@glimmer/component';
 * import buttonMachine from '../machines/button';
 *
 * export default class Button extends Component {
 *  @use sc = useMachine(buttonMachine)
 *
 *  @matchesState('disabled', 'sc')
 *  isDisabled;
 * }
 * ```
 *
 */
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
 * {@link ConfigurableMachineDefinition} into an {@link InterpreterUsable}.
 *
 * TypeScript can't deal with decorators changing types thus we need this
 * typecasting function because `@use`- will take what `useMachine`
 * returns and initialize the actual usable which is the thing that you will
 * work with from your code after accessing the usable's value.
 *
 * This function can be used in two ways:
 *
 * 1) Whenever you want to send an event to a statechart:
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
 * 2) By wrapping `useMachine` directly. This way you don't have to litter the
 *    rest of your code with `interpreterFor`:
 *
 * ```js
 * import { useMachine, interpreterFor } from 'ember-statecharts';
 *
 * class Foo extends EmberObject {
 *   @use statechart = interpreterFor(useMachine(...) {
 *     // ...
 *   })
 *
 *   someMethod() {
 *     this.statechart.send('WAT'); // ok!
 *   }
 * }
 * ```
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
