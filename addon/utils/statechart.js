import { resolve } from 'rsvp';

class State {
  constructor(config) {
    let { name, enterState, exitState, events, parent, context } = config;

    this.parent     = parent;
    this.name       = name;
    this.enterState = enterState || function() {};
    this.exitState  = exitState || function() {};

    if (context) {
      this.context = context;
    }

    let eventKeys = Object.keys(events || {});

    this.events = eventKeys.reduce((acc, eventName) => {
      acc[eventName] = events[eventName].bind(this);
      return acc;
    }, {});
  }

  goToState(stateName, data) {
    let newState = this.parent.states[stateName];

    return resolve()
      .then(() => this.exitState())
      .then(() => {
        this.parent.currentState = newState;
      })
      .then(() => {
        this.parent.didChangeState(newState);
      })
      .then(() => newState.enterState(data));
  }
}

export default class StateChart {
  constructor(config) {
    let { initialState, states, context, didChangeState } = config;

    let stateNames = Object.keys(states);

    let _states = stateNames.reduce((acc, stateName) => {
      let stateConfiguration = states[stateName];
      let stateConstructorParams = Object.assign(stateConfiguration, {
        name: stateName,
        parent: this,
        context
      });

      let state = new State(stateConstructorParams);

      acc[stateName] = state;

      return acc;
    }, {});

    this.states = _states;

    this.currentState = this.states[initialState];

    this.didChangeState = didChangeState || function() {};
  }

  send(eventName, data) {
    let eventHandler = this.currentState.events[eventName];

    if (eventHandler) {
      return resolve()
        .then(() => eventHandler(data));
    }
  }
}
