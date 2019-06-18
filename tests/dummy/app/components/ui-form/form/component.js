import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  onSubmit() {},

  actions: {
    submit(event) {
      event.preventDefault();

      return this.onSubmit();
    },
  },
});
