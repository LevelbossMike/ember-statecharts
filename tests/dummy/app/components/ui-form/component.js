import Component from '@ember/component';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { Buffer } from 'ember-validated-form-buffer';
import O, { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { buildValidations } from 'ember-cp-validations';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  Validations: null,

  onSubmit() {},
  onSuccess() {},
  onError() {},
  onInit() {},

  // BEGIN-SNIPPET ui-form-statechart.js

  // ...

  isUnchanged: matchesState({ form: { interaction: 'idle' } }),
  isInvalid: matchesState({ form: { validity: 'invalid' } }),
  isBusy: matchesState({ form: { interaction: 'loading' } }),
  userDidSubmitForm: matchesState({ form: { submitStatus: 'submitted' } }),

  statechart: statechart(
    {
      id: 'ui-form',
      initial: 'form',
      states: {
        form: {
          type: 'parallel',

          states: {
            validity: {
              initial: 'unknown',
              states: {
                unknown: {
                  on: {
                    validate: 'validating',
                  },
                },
                validating: {
                  onEntry: ['validateFormObject'],
                  on: {
                    valid: 'valid',
                    invalid: 'invalid',
                  },
                },
                valid: {
                  on: {
                    change: 'validating',
                  },
                },
                invalid: {
                  on: {
                    change: 'validating',
                  },
                },
              },
            },
            submitStatus: {
              initial: 'none',
              states: {
                none: {
                  on: {
                    submit: 'submitted',
                  },
                },
                submitted: {},
              },
            },
            interaction: {
              initial: 'idle',
              states: {
                idle: {
                  on: {
                    change: 'changed',
                  },
                },
                changed: {
                  on: {
                    change: [
                      {
                        target: 'idle',
                        cond: 'isPristine',
                      },
                      {
                        target: 'changed',
                      },
                    ],
                    submit: [
                      {
                        target: 'loading',
                        cond: 'formIsValid',
                      },
                    ],
                  },
                },
                loading: {
                  onEntry: ['submit'],

                  on: {
                    resolve: 'success',
                    reject: 'error',
                  },
                },
                success: {
                  onEntry: ['handleSuccess'],
                },
                error: {
                  onEntry: ['handleError'],
                  on: {
                    submit: 'loading',
                    change: 'changed',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      guards: {
        isPristine(context, { formObject }) {
          return context.formObjectIsPristine(formObject);
        },
        formIsValid(context) {
          return context.formObject.validations.isValid;
        },
      },
      actions: {
        validateFormObject(context) {
          context.validationTask.perform();
        },
        submit(context) {
          context.submitTask.perform();
        },
        handleSuccess(context, { data }) {
          context.onSuccess(data);
        },
        handleError(context, { error }) {
          context.onError(error);
        },
      },
    }
  ),

  didInsertElement() {
    this._super(...arguments);

    this.statechart.send('validate');
  },

  actions: {
    submit() {
      this.statechart.send('submit');
    },
    change() {
      this.statechart.send('change', { formObject: this.formObject });
    },
  },

  submitTask: task(function*() {
    try {
      this.formObject.applyBufferedChanges();

      const data = yield this.onSubmit(this.model);

      this.statechart.send('resolve', { data });
    } catch (error) {
      this.statechart.send('reject', { error });
    }
  }).drop(),

  validationTask: task(function*() {
    const { validations } = yield this.formObject.validate();

    if (validations.get('isValid')) {
      this.statechart.send('valid');
    } else {
      this.statechart.send('invalid');
    }
  }).restartable(),

  // ...

  // END-SNIPPET ui-form-statechart.js

  model: computed(function() {
    return O.create();
  }),

  formObject: computed('model', function() {
    const owner = getOwner(this);
    const Validations = this.Validations || buildValidations();

    return Buffer.extend(Validations).create(owner.ownerInjection(), {
      content: this.model,
    });
  }),

  init() {
    this._super(...arguments);

    this.onInit(this.get('statechart'));
  },
});
