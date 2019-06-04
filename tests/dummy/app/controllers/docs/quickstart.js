import Controller from '@ember/controller';
import { statechart } from 'ember-statecharts/computed';
import { inject as service } from '@ember/service';

function notifyActionName(context, event) {
  context.notifications.notify(`Triggered action \`${event.type}\``);
}

export default Controller.extend({
  notifications: service(),

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
          onEntry: ['handleSubmit'],
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
          onEntry: ['handleSubmit'],
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
          onEntry: ['handleSubmit'],
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
          onEntry: ['handleSubmit'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
          },
        },
        success: {
          onEntry: ['handleSuccess'],
        },
        error: {
          onEntry: ['handleError'],
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
          onEntry: ['handleSubmit'],
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
          },
        },
        success: {
          onEntry: ['handleSuccess'],
          on: {
            SUBMIT: 'busy',
          },
        },
        error: {
          onEntry: ['handleError'],
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
});
