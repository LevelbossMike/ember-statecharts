import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import delayedToggle from '../machines/delayed-toggle';

export default class DelayedToggle extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: delayedToggle,
    };
  });

  get isOn() {
    return this.statechart.state.matches('on');
  }
}
