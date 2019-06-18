import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  value: computed({
    get() {
      return `{
  id: 'quickstart-button',
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
    handleSubmit(context) {
      context.handleSubmitTask.perform();
    },
    handleSuccess(context) {
      context.onSuccess();
    },
    handleError(context) {
      context.onError();
    },
  },
}`;
    },
    set(key, value) {
      return value;
    },
  }),
});
