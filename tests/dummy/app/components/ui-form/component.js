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

  formObject: computed('model', function() {
    const owner = getOwner(this);
    const Validations = this.Validations || buildValidations();

    return Buffer.extend(Validations).create(owner.ownerInjection(), {
      content: this.model
    })
  }),

  model: computed(function() {
    return O.create();
  }),

  statechart: statechart({ 
    id: 'login-form',
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
                  validate: 'validating'
                }
              },
              validating: {
                on: {
                  valid: 'valid',
                  invalid: 'invalid'
                }
              },
              valid: {
                on: {
                  validate: 'validating'
                }
              },
              invalid: {
                on: {
                  validate: 'validating'
                }
              }
            }
          },
          interaction: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  change: 'changed'
                }
              },
              changed: {
                on: {
                  change: [
                    {
                      target: 'idle',
                      cond: 'isPristine'
                    },
                    {
                      target: 'changed'
                    }
                  ],
                  submit: 'loading'
                }
              },
              loading: {
                onEntry: ['submit'],

                on: {
                  resolve: 'success',
                  reject: 'error'
                }
              },
              success: {
                onEntry: ['handleSuccess']
              },
              error: {
                onEntry: ['handleError'],
                on: {
                  submit: 'loading',
                  change: 'changed'
                }
              }
            }
          }
        }
      }
    }
  }, {
    guards: {
      isPristine(context, { data: { formObject }}) {
        return context.formObjectIsPristine(formObject);
      }
    },
    actions: {
      submit() {},
      handleSuccess() {},
      handleError() {}
    }
  }),

  isUnchanged: matchesState({ form: { interaction: 'idle' } }),

  onSubmitTask: task(function*() {
    try {
      this.formObject.applyBufferedChanges();

      const data = yield this.onSubmit(this.model);

      this.statechart.send('resolve', { data });
    } catch(error) {
      this.statechart.send('reject', { error });
    }
  }).drop(),

  formObjectIsPristine(formObject) {
    return !formObject.hasBufferedChanges;
  },

  actions: {
    submit() {
      this.onSubmitTask.perform();
    },
    change() {
      this.statechart.send('change', { formObject: this.formObject });
    }
  }
});