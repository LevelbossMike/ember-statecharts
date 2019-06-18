import Controller from '@ember/controller';
import { Promise } from 'rsvp';
import { statechart } from 'ember-statecharts/computed';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Controller.extend({
  statechart: statechart(
    {
      initial: 'off',
      states: {
        off: {
          id: 'off',
          on: {
            power: 'on',
            wat: 'off',
          },
        },
        on: {
          initial: 'something',
          onEntry: ['yo'],
          states: {
            something: {
              on: {
                a: 'foobar',
                woot: '#off',
              },
              initial: 'c',
              states: {
                c: {
                  on: {
                    foo: 'd',
                  },
                  type: 'parallel',
                  states: {
                    interaction: {
                      initial: 'idle',
                      states: {
                        idle: {
                          on: {
                            yo: 'changed',
                          },
                        },
                        changed: {},
                      },
                    },
                    validity: {
                      initial: 'unknown',
                      states: {
                        unknown: {},
                        valid: {},
                      },
                    },
                  },
                },
                d: {
                  on: {
                    foo: 'c',
                  },
                },
              },
            },
            foobar: {
              on: {
                b: 'something',
              },
            },
          },
          on: {
            power: [
              {
                target: 'on',
                cond: 'wat',
              },
              {
                target: 'off',
                cond: 'notWat',
              },
            ],
          },
        },
      },
    },
    {
      guards: {
        wat() {},
        notWat() {},
      },
      actions: {
        yo() {},
      },
    }
  ),

  margin: '0',

  name: 'hello',

  edges: computed(function() {
    return [
      {
        source: 'red',
        target: 'blue',
      },
    ];
  }),

  actions: {
    woot() {
      return new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
    },

    registerEdge(id, element) {
      const { edges } = this;
      let container = edges.get('id');

      if (!container) {
        edges.set('id', A());
        container = edges.get('id');
      }

      container.pushObject({ element });
    },

    updateMargin({ target: { value } }) {
      this.set('margin', +value);
    },
  },
});
