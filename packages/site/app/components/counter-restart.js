// BEGIN-SNIPPET counter-update-restart
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { useMachine, matchesState } from 'ember-statecharts';
import CounterMachine from '../machines/counter-machine';

export default class CounterComponent extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: CounterMachine.withContext({
        count: this.args.count,
      }),
      update: ({ restart }) => {
        restart();
      },
    };
  });

  @matchesState('active')
  isActive;

  @matchesState('inactive')
  isDisabled;

  @action
  decrement() {
    this.statechart.send('DECREMENT');
  }

  @action
  increment() {
    this.statechart.send('INCREMENT');
  }

  @action
  activate() {
    this.statechart.send('ACTIVATE');
  }

  @action
  deactivate() {
    this.statechart.send('DEACTIVATE');
  }
}
// END-SNIPPET
