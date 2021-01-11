import useMachine, {
  ConfigurableMachineDefinition,
  InterpreterUsable,
} from './usables/use-machine';
import { EventObject, StateSchema, StateValue, Typestate } from 'xstate';
declare function matchesState(
  state: StateValue,
  statechartPropertyName?: string
): any;
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
declare function interpreterFor<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
>(
  configurableMachineDefinition: ConfigurableMachineDefinition<
    TContext,
    TStateSchema,
    TEvent,
    TTypestate
  >
): InterpreterUsable<TContext, TStateSchema, TEvent>;
export { useMachine, matchesState, interpreterFor };
