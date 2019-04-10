import { Machine, interpret } from 'xstate';
import { set } from '@ember/object';
import { later, cancel } from '@ember/runloop';

export default class Statechart {
  constructor(config, options, initialContext) {
    const machine = Machine(config, options, initialContext);
    this.service = interpret(machine, {
      clock: {
        setTimeout: (fn, ms) => {
          return later.call(null, fn, ms);
        },
        clearTimeout: timer => {
          return cancel.call(null, timer);
        },
      },
    })
      .onTransition(state => {
        set(this, 'currentState', state);
      })
      .start();
  }

  send(eventName, data = {}) {
    this.service.send({ type: eventName, ...data });
  }
}
