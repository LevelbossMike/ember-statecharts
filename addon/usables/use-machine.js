import { interpret, createMachine, StateNode } from 'xstate';
import { setUsableManager } from 'ember-usable';
import { later, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';
import { warn } from '@ember/debug';

export const ARGS_STATE_CHANGE_WARNING =
  'A change to passed `args` or a local state change triggered an update to a `useMachine`-usable. You can send a dedicated event to the machine or restart it so this is handled. This is done via the `.update`-hook of the `useMachine`-usable.';

export class InterpreterService {
  @tracked service;
  @tracked _state;

  constructor(machine, interpreterOptions, onTransition) {
    this.machine = machine;
    this.interpreterOptions = interpreterOptions || {};
    this.onTransition = onTransition;
  }

  get state() {
    return {
      state: this._state,
      send: this.service.send,
      service: this.service,
    };
  }

  setup(setupOptions = {}) {
    const { state } = this.interpreterOptions;

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
    }).onTransition((state) => {
      this._state = state;
    });

    if (this.onTransition) {
      this.service.onTransition(this.onTransition);
    }

    this.service.start(setupOptions.initialState || state);
  }

  teardown() {
    this.service.stop();
  }
}

export class MachineInterpreterManager {
  createUsable(context, { machine, interpreterOptions, _onTransition }) {
    const owner = getOwner(context);

    let onTransition;

    if (_onTransition) {
      onTransition = _onTransition.bind(context);
    }

    const interpreter = new InterpreterService(machine, interpreterOptions, onTransition);

    setOwner(interpreter, owner);

    return { interpreter };
  }

  getState({ interpreter }) {
    return interpreter.state;
  }

  setupUsable({ interpreter, setupOptions }) {
    interpreter.setup(setupOptions);
  }

  updateUsable(bucket, configurableMachineDefinition) {
    const { interpreter } = bucket;
    const { args, _update } = configurableMachineDefinition;

    if (_update) {
      const { machine, context, config } = args;
      _update({
        machine,
        context,
        config,
        send: interpreter.service.send,
        restart: this.restartUsable.bind(this, bucket, configurableMachineDefinition),
      });
    } else {
      warn(ARGS_STATE_CHANGE_WARNING, false, { id: 'statecharts.use-machine.args-state-change' });
    }
  }

  teardownUsable({ interpreter }) {
    // teardown interpreter
    interpreter.teardown();
  }

  restartUsable(bucket, configurableMachineDefinition, state) {
    this.teardownUsable(bucket);
    bucket.interpreter = this.createUsable(bucket, configurableMachineDefinition).interpreter;
    bucket.setupOptions = { initialState: state };
    this.setupUsable(bucket);
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
  configurableMachineDefinition.args = {
    machine,
    interpreterOptions,
  };

  configurableMachineDefinition.update = function (fn) {
    configurableMachineDefinition._update = fn;
    return configurableMachineDefinition;
  };

  configurableMachineDefinition.onTransition = function (fn) {
    configurableMachineDefinition._onTransition = fn;
    return configurableMachineDefinition;
  };

  configurableMachineDefinition.withConfig = function (config) {
    configurableMachineDefinition.machine = configurableMachineDefinition.machine.withConfig(
      config
    );
    configurableMachineDefinition.args.machine = configurableMachineDefinition.machine;
    configurableMachineDefinition.args.config = config;
    return configurableMachineDefinition;
  };

  configurableMachineDefinition.withContext = function (context) {
    configurableMachineDefinition.machine = configurableMachineDefinition.machine.withContext(
      context
    );
    configurableMachineDefinition.args.machine = configurableMachineDefinition.machine;
    configurableMachineDefinition.args.context = context;
    return configurableMachineDefinition;
  };

  return configurableMachineDefinition;
}
