import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import selfTransitionNoAssign from '../machines/self-transition-no-assign';

export default class SelfTransitionTest extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: selfTransitionNoAssign,
    };
  });

  self = () => {
    this.statechart.send('SELF');
  };

  number = 0;

  get numberOfChanges() {
    this.number++;
    // consume the state tracked property
    this.statechart.state;
    return this.number;
  }
}
