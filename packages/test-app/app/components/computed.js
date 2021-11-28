import Component from '@glimmer/component';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { toggleConfig } from '../machines/toggle-machine';
import { action } from '@ember/object';

export default class ComputedTest extends Component {
  @statechart(toggleConfig) statechart;

  @matchesState('on') isOn;
  @matchesState('off') isOff;

  @action toggle() {
    this.statechart.send('TOGGLE');
  }
}
