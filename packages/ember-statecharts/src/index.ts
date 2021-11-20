import { useMachine } from './-private/usables';

import { matchesState as xstateMatchesState } from 'xstate';

import type { StateValue } from 'xstate';

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

export { useMachine, matchesState };
