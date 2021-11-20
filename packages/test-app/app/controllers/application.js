import Controller from '@ember/controller';
import { action } from '@ember/object';
import { statechart } from 'ember-statecharts/computed';

export default class ApplicationController extends Controller {
  @statechart({
    initial: 'off',
    states: {
      off: {
        on: {
          TOGGLE: 'on',
        },
      },
      on: {
        on: {
          TOGGLE: 'off',
        },
      },
    },
  })
  statechart;

  @action
  toggle() {
    this.statechart.send('TOGGLE');
  }
}
