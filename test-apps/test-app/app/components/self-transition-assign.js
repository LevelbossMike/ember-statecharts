import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import selfTransitionAssign from '../machines/self-transition-assign';

export default class SelfTransitionTest extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: selfTransitionAssign,
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

  get count() {
    return this.statechart.state.context.count;
  }
}
