import Controller from '@ember/controller';
import { statechart } from 'ember-statecharts/computed';

function notifyActionName(context, event) {
  window.alert(`Triggered action \`${event.type}\``);
}

export default Controller.extend({
  finalStatechart: null,

  quickstartStepOne: statechart({
    id: 'quickstart-button-step-1',
    initial: 'idle',
    states: {
      idle: {},
      busy: {},
    },
  }),

  quickstartStepTwo: statechart({
    id: 'quickstart-button-step-2',
    initial: 'idle',
    states: {
      idle: {
        on: {
          SUBMIT: 'busy',
        },
      },
      busy: {},
    },
  }),

  quickstartStepThree: statechart(
    {
      id: 'quickstart-button-step-3',
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: 'busy',
          },
        },
        busy: {
          entry: ['handleSubmit'],
        },
      },
    },
    {
      actions: {
        handleSubmit: notifyActionName,
      },
    }
  ),

  quickstartStepFour: statechart(
    {
      id: 'quickstart-button-step-4',
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: 'busy',
          },
        },
        busy: {
          entry: ['handleSubmit'],
          on: {
            SUCCESS: 'success',
          },
        },
        success: {},
      },
    },
    {
      actions: {
        handleSubmit: notifyActionName,
      },
    }
  ),

  quickstartStepFive: statechart(
    {
      id: 'quickstart-button-step-5',
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: 'busy',
          },
        },
        busy: {
          entry: ['handleSubmit'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
          },
        },
        success: {},
        error: {},
      },
    },
    {
      actions: {
        handleSubmit: notifyActionName,
      },
    }
  ),

  quickstartStepSix: statechart(
    {
      id: 'quickstart-button-step-6',
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: 'busy',
          },
        },
        busy: {
          entry: ['handleSubmit'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
          },
        },
        success: {
          entry: ['handleSuccess'],
        },
        error: {
          entry: ['handleError'],
        },
      },
    },
    {
      actions: {
        handleSubmit: notifyActionName,
        handleSuccess: notifyActionName,
        handleError: notifyActionName,
      },
    }
  ),

  quickstartStepSeven: statechart(
    {
      initial: 'idle',
      id: 'quickstart-button-step-7',
      states: {
        idle: {
          on: {
            SUBMIT: 'busy',
          },
        },
        busy: {
          entry: ['handleSubmit'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
          },
        },
        success: {
          entry: ['handleSuccess'],
          on: {
            SUBMIT: 'busy',
          },
        },
        error: {
          entry: ['handleError'],
          on: {
            SUBMIT: 'busy',
          },
        },
      },
    },
    {
      actions: {
        handleSubmit: notifyActionName,
        handleSuccess: notifyActionName,
        handleError: notifyActionName,
      },
    }
  ),

  quickstartStepEight: statechart(
    {
      id: 'quickstart-button-step-8',
      type: 'parallel',
      states: {
        interactivity: {
          initial: 'unknown',
          states: {
            unknown: {
              on: {
                ENABLE: 'enabled',
                DISABLE: 'disabled',
              },
            },
            enabled: {
              on: {
                DISABLE: 'disabled',
              },
            },
            disabled: {
              on: {
                ENABLE: 'enabled',
              },
            },
          },
        },
        activity: {
          initial: 'idle',
          states: {
            idle: {
              on: {
                SUBMIT: {
                  target: 'busy',
                  cond: 'isEnabled',
                },
              },
            },
            busy: {
              entry: ['handleSubmit'],
              on: {
                SUCCESS: 'success',
                ERROR: 'error',
              },
            },
            success: {
              entry: ['handleSuccess'],
              on: {
                SUBMIT: {
                  target: 'busy',
                  cond: 'isEnabled',
                },
              },
            },
            error: {
              entry: ['handleError'],
              on: {
                SUBMIT: {
                  target: 'busy',
                  cond: 'isEnabled',
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        handleSubmit() {},
        handleSuccess() {},
        handleError() {},
      },
      guards: {
        isEnabled() {},
      },
    }
  ),
});
