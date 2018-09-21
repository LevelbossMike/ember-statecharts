import Component from '@ember/component';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import { computed } from '@ember/object';

cytoscape.use(coseBilkent);

function nodeLabel(node) {
  let label = `${node.id}`

  if (node.onExit && node.onExit.length || node.onEntry && node.onEntry.length) {
    label = `${label}\n---`;
  }
  // this will be an array of function names
  if (node.onEntry && node.onEntry.length) {
    const onEntryCalls = node.onEntry.map((fnName) => `${fnName}()`).join(', ');

    label = `${label}\nonEntry / ${onEntryCalls}`;
  }

  if (node.onExit && node.onExit.length) {
    const onExitCalls = node.onExit.map((fnName) => `${fnName}()`).join(', ');

    label = `${label}\nonExit / ${onExitCalls}`;
  }

  return label;
}

function edgeColor(edgeElement) {
  if (edgeElement.data('label') === '') {
    return 'red';
  }
  return 'black';
}

function buildNodesAndEdges(machine) {
  let nodes = [];
  let edges = [];

  function addNodesAndEdges(node, key, parent, { parentIsParallel } = {}) {
    const id = parent ? parent + '.' + key : key;

    if (parent) {
      nodes.push({
        data: {
          id,
          // we need to add onEntry/onExit here
          label: nodeLabel(node),
          parent,
          parentIsParallel,
        }
      });
    }

    if (node.states) {
      const stateNames = Object.keys(node.states);
      let states = stateNames
        .map(key => {
          const clone = Object.assign({}, node.states[key]);
          clone.id = key;
          return clone;
        })

      if (states.length > 0) {
        states = states.concat({
          id: '$initial',
          initial: 1,
          on: {'': [{ target: node.initial }] }
        });
      }

      states.forEach(state => {
        addNodesAndEdges(state, state.id, id, { parentIsParallel: node.parallel })
      });
    }

    if (node.on) {
      const visited = {};
      Object.keys(node.on).forEach(event => {
        const [{target}] = node.on[event];
        (visited[target] || (visited[target] = [])).push(event);
      });

      Object.keys(visited).forEach(target => {
        edges.push({
          data: {
            id: key + ':' + target,
            source: id,
            target: parent ? parent + '.' + target : target,
            label: visited[target].join(',\n'),
          }
        });
      });
    }
  }

  addNodesAndEdges(machine, machine.id || 'machine');

  return {
    nodes, edges
  };
}

export default Component.extend({
  machine: computed({
    get() {
      return null;
    },
    set(key, value) {
      try {
        this._initContainer(value);
      } catch(e) {
        return null;
      }

      return value;
    }
  }),

  _initContainer(machine) {
    const { nodes, edges } = buildNodesAndEdges(machine);
    const container = this.element;

    const cyInstance = cytoscape({
      container,

      elements: {
        nodes, edges
      },

      layout: {
        name: 'cose-bilkent',
        idealEdgeLength: 120,
        animate: false,
        nodeDimensionsIncludeLabels: true,
      },

      style: [
        {
          selector: 'node',
          style: {
            'width': 'label',
            'shape': 'roundrectangle',
            'background-color': 'white',
            'text-wrap': 'wrap',
            'label': function(ele) {
              if (ele.data('label') !== '$initial') {
                return ele.data('label');
              }

              return 'a';
            },
            'text-valign': function(ele) {
              // eslint-disable-next-lint

              if (ele.isParent()) {
                return 'top';
              }

              return 'center';
            },
            'visibility': function(ele) {
               if (ele.data('label') === '$initial') {
                 return 'hidden';
               }
               return 'visible';
            },
            'text-halign': 'center',
            'text-margin-y': function(ele) {
              if (ele.isParent()) {
                return '32px';
              }
              return '0';
            },
            'padding': '32px',
            'border-width': '2px',
            'border-color': 'black',
            'border-style': function(ele) {
              if (ele.data('parentIsParallel')) {
                return 'dashed';
              }
              return 'solid';
            },
            'font-size': '20rem',
          }
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'curve-style': function(ele) {

              if (ele.data('label') ==='') {
                return 'bezier';
              }
              return 'unbundled-bezier';
            },
            'source-arrow-shape': function(ele) {
              if (ele.data('label') === '') {
                return 'circle';
              }

              return 'none';
            },
            'source-arrow-color': edgeColor,
            'target-arrow-color': edgeColor,
            'target-arrow-shape': 'triangle',
            'source-label': 'data(label)',
            'source-text-offset': '40px',
            'text-background-opacity': '1',
            'text-background-color': 'white',
            'text-background-shape': 'roundrectangle',
            'text-background-padding': '3px',
            'line-color': edgeColor
          }
        }

      ]
    });
    this.set('cy', cyInstance);
  },
});
