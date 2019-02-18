import Component from '@ember/component';
import O, { computed } from '@ember/object';
import { buildValidations, validator } from 'ember-cp-validations';

const Validations = buildValidations({
  email: validator('format', {
    type: 'email'
  }),
  password: validator('length', {
    min: 9
  })
});

export default Component.extend({
  tagName: '',

  Validations,

  formObject: computed(function() {
    return O.create({
      email: '',
      password: ''
    })
  }),

  loginPristine(formObject) {
    const {
      email,
      password,
      content: { email: originalEmail, password: originalPassword },
    } = formObject.getProperties(['content', 'email', 'password']);

    return email === originalEmail && password === originalPassword
  },

  actions: {
    login(event) {
      event.preventDefault();

      console.log('logging in');
    }
  }
});