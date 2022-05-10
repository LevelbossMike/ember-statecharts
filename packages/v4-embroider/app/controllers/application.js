import Controller from '@ember/controller';
// import * as xstate from 'xstate';
import { createMachine } from 'xstate';
import { useMachine, matchesState } from 'ember-statecharts';

const toggleMachine = createMachine({
  initial: 'off',

  states: {
    off: {
      on: {
        TOGGLE: 'on',
      },
    },
    on: {
      on: {
        TOGGLE: 'off',
      },
    },
  },
});

export default class ApplicationController extends Controller {
  text = 'Hello World!';

  statechart = useMachine(this, () => {
    return {
      machine: toggleMachine,
    };
  });

  @matchesState('off')
  isOff;
}
