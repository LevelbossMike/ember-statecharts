import Controller from '@ember/application';
import { createMachine } from 'xstate';

const toggleMachine = createMachine({
  initial: 'off',
  states: {
    off: {
      on: {
        ON: 'on',
      },
    },
    on: {
      on: {
        OFF: 'off',
      },
    },
  },
});

export default class ApplicationController extends Controller {}
