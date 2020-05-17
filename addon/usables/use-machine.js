import { interpret, createMachine, StateNode } from 'xstate';
import { setUsableManager } from 'ember-usable';
import { later, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';
import { warn } from '@ember/debug';

export const ARGS_STATE_CHANGE_WARNING =
  'A change to passed `args` or a local state change triggered an update to a `useMachine`-usable. This is currently unsupported and should probably be handled explicitly in your xstate-machine. If you feel this is necessary behavior that should be supported by `ember-statecharts` please raise this as an issue and provide an example of what you are trying to do.';

export class InterpreterService {
  @tracked service;
  @tracked _state;

  constructor(machine, interpreterOptions) {
    this.machine = machine;
    this.interpreterOptions = interpreterOptions || {};
  }

  get state() {
    return {
      state: this._state,
      send: this.service.send,
      service: this.service,
    };
  }

  setup() {
    this.service = interpret(this.machine, {
      devTools: DEBUG,
      ...this.interpreterOptions,
      clock: {
        setTimeout(fn, ms) {
          return later.call(null, fn, ms);
        },
        clearTimeout(timer) {
          return cancel.call(null, timer);
        },
      },
    })
      .onTransition((state) => {
        this._state = state;
      })
      .start();
  }

  teardown() {
    this.service.stop();
  }

  send() {
    this.service.send(...arguments);
  }
}

export class MachineInterpreterManager {
  createUsable(context, { machine, interpreterOptions }) {
    const owner = getOwner(context);

    const interpreter = new InterpreterService(machine, interpreterOptions);

    setOwner(interpreter, owner);

    return { interpreter };
  }

  getState({ interpreter }) {
    return interpreter.state;
  }

  setupUsable({ interpreter }) {
    interpreter.setup();
  }

  updateUsable() {
    // not sure if it makes sense to support this - issue warning
    warn(ARGS_STATE_CHANGE_WARNING, false, { id: 'statecharts.use-machine.args-state-change' });
  }

  teardownUsable({ interpreter }) {
    // teardown interpreter
    interpreter.teardown();
  }
}
const createMachineInterpreterManager = () => {
  return new MachineInterpreterManager();
};

const MANAGED_INTERPRETER = {};
setUsableManager(MANAGED_INTERPRETER, createMachineInterpreterManager);

export default function useMachine(machine, interpreterOptions = {}) {
  const configurableMachineDefinition = Object.create(MANAGED_INTERPRETER);

  machine = machine instanceof StateNode ? machine : createMachine(machine);

  configurableMachineDefinition.machine = machine;
  configurableMachineDefinition.interpreterOptions = interpreterOptions;

  configurableMachineDefinition.withConfig = function (config) {
    configurableMachineDefinition.machine = configurableMachineDefinition.machine.withConfig(
      config
    );
    return configurableMachineDefinition;
  };
  configurableMachineDefinition.withContext = function (context) {
    configurableMachineDefinition.machine = configurableMachineDefinition.machine.withContext(
      context
    );
    return configurableMachineDefinition;
  };

  return configurableMachineDefinition;
}
