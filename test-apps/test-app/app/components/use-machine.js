import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import toggleMachine from '../machines/toggle';

export default class UseMachineTest extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: toggleMachine,
    };
  });

  get isOn() {
    return this.statechart.state.matches('on');
  }

  get isOff() {
    return this.statechart.state.matches('off');
  }

  toggle = () => {
    this.statechart.send('TOGGLE');
  };
}
