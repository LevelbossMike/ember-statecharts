import Component from '@ember/component';
import O, { computed } from '@ember/object';
import { buildValidations, validator } from 'ember-cp-validations';
import { timeout } from 'ember-concurrency';
import { resolve, reject } from 'rsvp';
import { inject as service } from '@ember/service';

const Validations = buildValidations({
  email: validator('format', {
    type: 'email',
  }),
  password: validator('length', {
    min: 9,
  }),
});

export default Component.extend({
  notifications: service('es-notifications'),

  tagName: '',

  Validations,

  onRegisterStatechart() {},

  formObject: computed(function() {
    return O.create({
      email: '',
      password: '',
    });
  }),

  loginPristine(formObject) {
    const {
      email,
      password,
      content: { email: originalEmail, password: originalPassword },
    } = formObject.getProperties(['content', 'email', 'password']);

    return email === originalEmail && password === originalPassword;
  },

  // BEGIN-SNIPPET ui-login-form.js

  //...

  actions: {
    async login({ email, password }) {
      await timeout(1000);

      if (email === 'tomster@effective-ember.com' && password === 'emberrocks') {
        resolve();
      } else {
        return reject('Invalid login credentials!');
      }
    },
    handleLoginSuccess() {
      this.notifications.notify('Login was successful');
    },

    handleLoginError(error) {
      this.notifications.notify(error);
    },
  },

  // ...
  // END-SNIPPET ui-login-form.js
});
