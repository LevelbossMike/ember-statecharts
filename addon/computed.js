import { computed, get } from '@ember/object';
import { matchesState } from 'xstate';
import { A, makeArray } from '@ember/array';
import Statechart from './utils/statechart';
import { assign } from '@ember/polyfills';

function matchesStateComputed(states) {
  return computed('statechart.currentState', function() {
    const _states = A(makeArray(states));

    return _states.any(state => {
      return matchesState(state, get(this, 'statechart.currentState.value'));
    });
  });
}

function debugState() {
  return computed('statechart.currentState', function() {
    return JSON.stringify(get(this, 'statechart.currentState.value'));
  });
}

function statechart(statechartConfig, statechartOptions) {
  return computed(function() {
    const statechart = new Statechart(
      assign(statechartConfig, { context: this }),
      statechartOptions
    );

    statechart.start();

    return statechart;
  });
}

export { matchesStateComputed as matchesState, debugState, statechart };
