import { Promise, resolve } from 'rsvp';
import { Machine } from 'xstate';
import { set } from '@ember/object';

function noOp() {}

class Interpreter {
  constructor({ config, options, context }) {
    this.machine = Machine(config, options);

    this.currentState = this.machine.initialState;

    this.context = context;
  }

  send(eventName, data) {
    const newState = this.machine.transition(
      this.currentState,
      { type: eventName, data },
      this.context
    );

    this.currentState = newState;

    let { actions } = newState;

    let _actions = actions.map(action => action.exec.bind(this.context));

    let chain = _actions.reduce((acc, action) => {
      return acc.then(() => {
        return action(data);
      });
    }, resolve());

    return chain;
  }
}

export default class Statechart {
  constructor(config, options) {
    this.machine = Machine(config, options);
    this.sendQueue = [];

    this.service = new Interpreter({
      config: {
        initial: 'initializing',
        states: {
          initializing: {
            on: {
              didInit: {
                target: 'initialized',
                actions: ['executeSendQueue'],
              },
              send: {
                target: 'initializing',
                actions: ['enqueueSend'],
              },
            },
          },
          initialized: {
            on: {
              send: {
                target: 'initialized',
                actions: ['executeSend'],
              },
            },
          },
        },
      },
      options: {
        actions: {
          enqueueSend(sendData) {
            this.sendQueue.push(sendData);
            return this.initPromise;
          },
          executeSendQueue() {
            let sends = this.sendQueue;
            let chain = sends.reduce((acc, { eventName, data }) => {
              return acc.then(() => {
                return this.send(eventName, data);
              });
            }, resolve());

            return chain.then(() => {
              this.resolveInit();
            });
          },
          executeSend(sendData) {
            return this._send(sendData);
          },
        },
      },
      context: this,
    });

    this.didChangeState = config.didChangeState || noOp;
    this.context = config.context;

    this.initPromise = new Promise((resolve, reject) => {
      this.resolveInit = resolve;
      this.rejectInit = reject;
    });
  }

  start() {
    this.currentState = this.machine.initialState;

    return this._executeActions(this.currentState).then(() => {
      return this.service.send('didInit');
    });
  }

  send(eventName, data = {}) {
    return this.service.send('send', { eventName, data });
  }

  _send({ eventName, data }) {
    let newState = this.machine.transition(
      this.currentState,
      { type: eventName, data },
      this.context
    );

    set(this, 'currentState', newState);

    this.didChangeState(newState);

    return this._executeActions(newState, data);
  }

  _executeActions(newState, data) {
    let { actions } = newState;

    let _actions = actions.map(this._functionForAction.bind(this));

    let chain = _actions.reduce((acc, action) => {
      return acc.then(() => {
        return action(data, this.context);
      });
    }, resolve());

    return chain;
  }

  _functionForAction(action) {
    let fn = (action.exec && action.exec.bind(this.context)) || noOp;
    return fn;
  }
}
