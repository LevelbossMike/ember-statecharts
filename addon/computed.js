import { computed, get } from '@ember/object';
import { matchesState } from 'xstate';
import { A, makeArray } from '@ember/array';

function matchesStateComputed(states) {
  return computed('currentState', function() {
    const _states = A(makeArray(states));

    return _states.any(state => {
      return matchesState(state, get(this, 'currentState.value'));
    });
  });
}

function debugState() {
  return computed('currentState', function() {
    return JSON.stringify(get(this, 'currentState.value'));
  });
}

export {
  matchesStateComputed as matchesState,
  debugState
 };