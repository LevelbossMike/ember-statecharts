import Controller from '@ember/controller';
import { createMachine } from 'xstate';
import { useMachine } from 'ember-statecharts';

const toggleMachine = createMachine({
  predictableActionArguments: true,
  initial: 'off',
  states: {
    on: {
      on: {
        TOGGLE: 'off',
      },
    },
    off: {
      on: {
        TOGGLE: 'on',
      },
    },
  },
});

export default class ApplicationController extends Controller {
  statechart = useMachine(this, () => {
    return {
      machine: toggleMachine,
    };
  });

  toggle = () => {
    this.statechart.send('TOGGLE');
  };
}
