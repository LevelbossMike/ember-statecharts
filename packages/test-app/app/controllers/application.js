import Controller from '@ember/controller';
import { action } from '@ember/object';
import { statechart } from 'ember-statecharts/computed';
import { useMachine } from 'ember-statecharts';
import { createMachine } from 'xstate';

const fuMachine = createMachine({
  initial: 'lol',
  states: {
    lol: {
      on: {
        FUBAR: 'fubar',
      },
    },
    fubar: {
      on: {
        FUBAR: 'lol',
      },
    },
  },
});

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

  wat = useMachine(this, () => {
    return {
      machine: fuMachine,
    };
  });

  @action
  toggle() {
    this.statechart.send('TOGGLE');
  }

  @action
  fubar() {
    this.wat.send('FUBAR');
  }
}
