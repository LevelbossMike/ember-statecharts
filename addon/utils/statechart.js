import { Machine, interpret } from 'xstate';
import { set } from '@ember/object';

export default class Statechart {
  constructor(config, options, initialContext) {
    const machine = Machine(config, options, initialContext);
    this.service = interpret(machine)
      .onTransition(state => {
        set(this, 'currentState', state);
      })
      .start();
  }

  send(eventName, data = {}) {
    this.service.send({ type: eventName, data });
  }
}
