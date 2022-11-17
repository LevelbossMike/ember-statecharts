import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import { createMachine } from 'xstate';

const toggleMachine = createMachine({
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
  predictableActionArguments: true,
});

export default class ToggleComponent extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: toggleMachine,
    };
  });

  toggle = () => {
    this.statechart.send({ type: 'TOGGLE' });
  };
}
