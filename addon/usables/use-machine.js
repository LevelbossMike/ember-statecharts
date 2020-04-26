import { interpret } from 'xstate';
import { setUsableManager } from 'ember-usable';
import { later, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';

export class InterpreterService {
  @tracked service;
  @tracked currentState;

  constructor(machine) {
    this.machine = machine;
  }

  get state() {
    return {
      currentState: this.currentState,
      send: this.service.send,
    };
  }

  setup() {
    this.service = interpret(this.machine, {
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
        this.currentState = state;
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
  createUsable(context, { machine }) {
    const owner = getOwner(context);

    const interpreter = new InterpreterService(machine);

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
    // not sure if it makes sense to support this
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

export default function useMachine(machine) {
  const configurableMachineDefinition = Object.create(MANAGED_INTERPRETER);

  configurableMachineDefinition.machine = machine;

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
