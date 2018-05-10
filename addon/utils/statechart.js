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

  eventByName(eventName) {
    return this.events[eventName];
  }
}

export default class StateChart {
  constructor(config) {
    let { initialState, states, context, didChangeState, name, events, parent, enterState, exitState } = config;

    let stateNames = Object.keys(states);

    let _states = stateNames.reduce((acc, stateName) => {
      let stateConfiguration = states[stateName];
      let stateConstructorParams = Object.assign(stateConfiguration, {
        name: stateName,
        parent: this,
        context
      });

      let state;

      if (stateConfiguration.states) {
        state = new StateChart(stateConstructorParams);
      } else {
        state = new State(stateConstructorParams);
      }

      acc[stateName] = state;

      return acc;
    }, {});

    this.states = _states;
    this.initialState = initialState;

    if (name) {
      this.name = name;
    }

    if (parent) {
      this.parent = parent;
    }

    if (context) {
      this.context = context;
    }

    this._enterState = enterState || function() {};
    this._exitState  = exitState || function() {};

    let eventKeys = Object.keys(events || {});

    this.events = eventKeys.reduce((acc, eventName) => {
      acc[eventName] = events[eventName].bind(this);
      return acc;
    }, {});

    this.currentState = this.states[this.initialState];

    this.didChangeState = didChangeState || function() {};
  }

  get name() {
    return `${this._name}.${this.currentState.name}`;
  }

  set name(name) {
    this._name = name;
  }

  enterState() {
    this.currentState = this.states[this.initialState];

    return resolve()
      .then(() => this._enterState(...arguments))
      .then(() => this.currentState.enterState(...arguments));
  }

  exitState() {
    return resolve()
      .then(() => this.currentState.exitState(...arguments))
      .then(() => this._exitState(...arguments));
  }

  send(eventName, data) {
    let eventHandler = this.currentState.eventByName(eventName);

    if (eventHandler) {
      return resolve()
        .then(() => eventHandler(data));
    }
  }

  eventByName(eventName) {
    return this.currentState.eventByName(eventName) || this.events[eventName];
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
