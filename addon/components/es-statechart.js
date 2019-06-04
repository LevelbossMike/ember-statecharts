import Component from '@ember/component';
import layout from '../templates/components/es-statechart';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { statechart, matchesState } from 'ember-statecharts/computed';
import { assert } from '@ember/debug';

export default Component.extend({
  layout,

  statechartRegistry: service(),

  statechart: null,

  previewMode: false,

  guid: computed(function() {
    return guidFor(this);
  }),

  isInitialized: matchesState('initialized', '_statechart'),

  service: readOnly('statechart.service'),

  machine: readOnly('service.machine'),

  _statechart: statechart(
    {
      initial: 'willInitialize',

      states: {
        willInitialize: {
          on: {
            INIT_STATECHART: 'initialized',
            ASSERT_STATECHART: 'error',
          },
        },
        initialized: {
          onEntry: ['registerContainer'],
          on: {
            INIT_STATECHART: 'initialized',
            ASSERT_STATECHART: 'error',
          },
        },
        error: {
          onEntry: ['assertStatechart'],
          on: {
            INIT_STATECHART: 'initialized',
          },
        },
      },
    },
    {
      actions: {
        registerContainer(context) {
          context
            .get('statechartRegistry')
            .registerContainer(
              context.get('guid'),
              context.get('statechart'),
              context.get('previewMode')
            );
        },

        assertStatechart() {
          assert('You must pass a `statechart`-property to `es-statechart`');
        },
      },
    }
  ),

  didReceiveAttrs() {
    this._super(...arguments);

    if (!this.get('statechart')) {
      this._statechart.send('ASSERT_STATECHART');
    } else {
      this._statechart.send('INIT_STATECHART');
    }
  },

  willDestroyElement() {
    this.get('statechartRegistry').deregisterContainer(this.get('guid'));

    this._super(...arguments);
  },
});
