import { useMachine } from './-private/usables';
import type { StateValue } from 'xstate';
/**
 * A decorator that can be used to create a getter that matches against an
 * {@link Statechart}'s state and will return either `true` or `false`
 *
 *
 * ```js
 * import Component from '@glimmer/component';
 * import buttonMachine from '../machines/button';
 *
 * export default class Button extends Component {
 *  @use statechart = useMachine(this, () => {
 *    return {
 *      machine: buttonMachine
 *    }
 *  })
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
 * By default `matchesState` expects your {@link Statechart} to be called `statechart`.
 * If you named it differently you can use the second param to this decorator:
 *
 *
 * ```js
 * import Component from '@glimmer/component';
 * import buttonMachine from '../machines/button';
 *
 * export default class Button extends Component {
 *  @use sc = useMachine(this, () => {
 *    return {
 *      machine: buttonMachine
 *    }
 *  })
 *
 *  @matchesState('disabled', 'sc')
 *  isDisabled;
 * }
 * ```
 *
 */
declare function matchesState(
  state: StateValue,
  statechartPropertyName?: string
): any;
export { useMachine, matchesState };
