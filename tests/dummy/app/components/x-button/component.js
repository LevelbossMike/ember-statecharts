import Component from '@ember/component';
import { get } from '@ember/object';
import { or } from '@ember/object/computed';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { task } from 'ember-concurrency';
import Evented, { on } from '@ember/object/evented';

export default Component.extend(Evented, {
  tagName: 'button',

  onClick() {},
  onSuccess() {},
  onError() {},

  attributeBindings: ['isDisabled:disabled'],

  isDisabled: or('isBusy', 'isInDisabledState'),

  isBusy: matchesState({
    initialized: {
      activity: 'busy',
    },
  }),

  isInDisabledState: matchesState({
    initialized: {
      interactivity: 'disabled',
    },
  }),

  statechart: statechart(
    {
      initial: 'init',
      states: {
        init: {
          on: {
            init: 'initialized',
          },
        },
        initialized: {
          type: 'parallel',
          states: {
            interactivity: {
              initial: 'unknown',
              states: {
                unknown: {
                  onEntry: ['checkDisabled'],
                  on: {
                    disable: 'disabled',
                  },
                },
                enabled: {},
                disabled: {},
              },
            },
            activity: {
              initial: 'idle',
              states: {
                idle: {
                  on: {
                    click: 'busy',
                  },
                },
                busy: {
                  onEntry: ['triggerAction'],
                  on: {
                    success: 'success',
                    error: 'error',
                  },
                },
                success: {
                  onEntry: ['triggerSuccess'],
                },
                error: {
                  onEntry: ['triggerError'],
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        checkDisabled(ctx) {
          if (ctx.get('disabled')) {
            ctx.get('statechart').send('disable');
          }
        },
        triggerAction(ctx) {
          ctx.get('onClickTask').perform();
        },
        triggerSuccess(ctx) {
          ctx.get('onSuccess')();
        },
        triggerError(ctx) {
          ctx.get('onError')();
        },
      },
    }
  ),

  init() {
    this._super(...arguments);

    this.get('statechart').send('init');
  },

  onClickTask: task(function*() {
    const result = yield this.onClick();

    return result;
  })
    .drop()
    .evented(),

  // eslint-disable-next-line ember/no-on-calls-in-components
  handleOnClickSuccess: on('onClickTask:succeeded', function() {
    this.get('statechart').send('success');
  }),

  // eslint-disable-next-line ember/no-on-calls-in-components
  handleOnClickError: on('onClickTask:errored', function() {
    this.get('statechart').send('error');
  }),

  click() {
    return get(this, 'statechart').send('click');
  },

  resolve() {
    get(this, 'states').send('resolve');
  },

  reject() {
    get(this, 'states').send('reject');
  },
});
