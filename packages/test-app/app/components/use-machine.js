import Component from '@glimmer/component';
import { useMachine, matchesState } from 'ember-statecharts';
import toggleMachine from '../machines/toggle-machine';
import { action } from '@ember/object';

export default class UseMachineTest extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: toggleMachine,
    };
  });

  @matchesState('on') isOn;
  @matchesState('off') isOff;

  @action toggle() {
    this.statechart.send('TOGGLE');
  }
}
