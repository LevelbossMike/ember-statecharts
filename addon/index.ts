export { useMachine } from './usables/use-machine';
export { Interpreter } from './usables/interpreter';

import { matchesState as xstateMatchesState, StateValue } from 'xstate';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function matchesState(state: StateValue, statechartPropertyName = 'statechart'): any {
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
