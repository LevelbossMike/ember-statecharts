import { Machine, interpret } from 'xstate';
import { set } from '@ember/object';
import { later, cancel } from '@ember/runloop';
import { warn } from '@ember/debug';

export default class Statechart {
  constructor(config, options, initialContext) {
    if (arguments.length === 0) {
      return;
    }
    const machine = Machine(config, options, initialContext);
    this._setupMachine(machine);
  }

  static withMachine(machine, initialContext) {
    const statechart = new Statechart();
    if (initialContext) {
      statechart._setupMachine(machine.withContext(initialContext));
    }
    return statechart;
  }

  _setupMachine(machine) {
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

  send(event, data = {}) {
    if (arguments.length === 1) {
      this._sendEventObject(event);
    } else {
      const { type, ...eventData } = data;
      if (type) {
        warn(
          `You passed property \`type\` as part of the data you sent with the event \`${event}\` . This is not supported - \`${event}\` will be used as event name.`,
          false,
          { id: 'statecharts.event-object.no-override-type' }
        );
      }
      const eventObject = { ...eventData, type: event };

      this._sendEventObject(eventObject);
    }
  }

  _sendEventObject(eventObject) {
    this.service.send(eventObject);
  }
}
