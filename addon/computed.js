import { computed, get } from '@ember/object';
import { matchesState } from 'xstate';
import { A, makeArray } from '@ember/array';
import Statechart from './utils/statechart';

function decorateStopInterpreterOnDestroy(destroyFn, service) {
  return function() {
    service.stop();

    destroyFn.apply(this, ...arguments);
  };
}

function matchesStateComputed(states, statechartPropertyName = 'statechart') {
  return computed(`${statechartPropertyName}.currentState`, function() {
    const _states = A(makeArray(states));

    return _states.any(state => {
      return matchesState(state, get(this, `${statechartPropertyName}.currentState.value`));
    });
  });
}

function debugState(statechartPropertyName = 'statechart') {
  return computed(`${statechartPropertyName}.currentState`, function() {
    return JSON.stringify(get(this, `${statechartPropertyName}.currentState.value`));
  });
}

function statechart(config, options) {
  return computed(function() {
    const initialContext = this;

    const statechart = new Statechart(config, options, initialContext);

    this.willDestroy = decorateStopInterpreterOnDestroy(this.willDestroy, statechart.service);

    return statechart;
  });
}

export { matchesStateComputed as matchesState, debugState, statechart };
