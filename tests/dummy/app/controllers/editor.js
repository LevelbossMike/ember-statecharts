import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  value: computed({
    get() {
      return `{
  initial: 'off',
  states: {
    off: {
      on: {
        POWER: 'on'
      }
    },
    on: {
      on: {
        POWER: 'off'
      }
    }
  }
}`;
    },
    set(key, value) {
      return value;
    },
  }),
});
