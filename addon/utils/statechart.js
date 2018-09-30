import { resolve } from 'rsvp';
import { Machine } from 'xstate';
import { set } from '@ember/object';

export default class Statechart {
  constructor(config, options) {
    this.machine = Machine(config, options);

    this.didChangeState = config.didChangeState || function() {};
    this.context = config.context;

    this.currentState = this.machine.initialState;
  }
  send(eventName, data = {}) {
    let newState = this.machine.transition(this.currentState, { type: eventName, data }, this.context);

    set(this, 'currentState', newState);

    let { actions } = newState;

    this.didChangeState(newState);

    let _actions = actions.map(this._functionForAction.bind(this));

    let chain = _actions.reduce((acc, action) => {
      return acc.then(() => {
        return action(data, this.context);
      });
    }, resolve());

    return chain;
  }
  _functionForAction(action) {
    if (typeof action === 'string') {
      return (this.context && this.context[action] && this.context[action].bind(this.context)) || function() {};
    }

    return action;
  }
}
