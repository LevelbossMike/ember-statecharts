// BEGIN-SNIPPET counter-update-restart
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { useMachine } from 'ember-statecharts';
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

  get isActive() {
    return this.statechart.state.matches('active');
  }

  get isDisabled() {
    return this.statechart.state.matches('inactive');
  }

  @action decrement() {
    this.statechart.send('DECREMENT');
  }

  @action increment() {
    this.statechart.send('INCREMENT');
  }

  @action activate() {
    this.statechart.send('ACTIVATE');
  }

  @action deactivate() {
    this.statechart.send('DEACTIVATE');
  }
}
// END-SNIPPET
