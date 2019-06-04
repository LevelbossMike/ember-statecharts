/* eslint-disable no-undef */
import Component from '@ember/component';
import layout from '../templates/components/es-leader-line';
import { statechart } from 'ember-statecharts/computed';
import { getProperties } from '@ember/object';

// export these codes to clean this up
const IDLE_GREY = 'rgb(200,200,200, 0.5)';
const ACTIVE_GREY = 'rgb(128,128,128, 0.8)';

export default Component.extend({
  layout,
  tagName: '',

  line: null,

  statechart: statechart(
    {
      initial: 'notDrawn',
      states: {
        notDrawn: {
          on: {
            DATA_RECEIVED: {
              target: 'drawn',
              actions: ['draw'],
            },
          },
        },
        drawn: {
          on: {
            DATA_RECEIVED: {
              target: 'drawn',
              actions: ['redraw'],
            },
          },
        },
      },
    },
    {
      actions: {
        draw(context, { startElement, endElement, edge }) {
          let line;
          if (edge.isInitialEdge) {
            // x: 0 means left side of element / y-axis is pointing downwards
            const startPointAnchor = LeaderLine.pointAnchor(startElement);
            const endPointAnchor = LeaderLine.pointAnchor(endElement, { x: 0, y: 10 });
            line = new LeaderLine(startPointAnchor, endPointAnchor, {
              size: 2,
              path: 'arc',
              color: ACTIVE_GREY,
              endSocketGravity: 20,
            });
          } else {
            const {
              width,
              height: heightEnd,
              y: yEnd,
              x: xEnd,
            } = endElement.getBoundingClientRect();
            const {
              y: yStart,
              x: xStart,
              height: heightStart,
              width: startWidth,
            } = startElement.getBoundingClientRect();

            line = new LeaderLine(startElement, endElement, {
              size: 2,
              path: 'arc',
              color: IDLE_GREY,
            });

            // handle self reference - anchor to the bottom to create a nice self-reference arrow
            if (edge.source === edge.target) {
              const yStartAnchor = heightEnd - (yEnd + heightEnd - (yStart + heightStart));

              const startPointAnchor = LeaderLine.pointAnchor(startElement, { x: startWidth });

              const endPointAnchor = LeaderLine.pointAnchor(endElement, {
                x: width,
                y: yStartAnchor + 20,
              });

              line.setOptions({
                start: startPointAnchor,
                end: endPointAnchor,
                path: 'arc',
                endSocketGravity: -100,
              });
            } else {
              // normal transition - check if end is left to start because we want to point to the top in that case
              if (xEnd + width < xStart + startWidth) {
                const endPointAnchor = LeaderLine.pointAnchor(endElement, { x: width - 20, y: 0 });

                line.setOptions({ startSocket: 'top', end: endPointAnchor, endSocketGravity: 10 });
              } else {
                // check if start is higher up than the middle of the targetNode if this is the case use the top - left as anchor
                if (yStart + heightStart < yEnd + heightEnd / 2) {
                  const endPointAnchor = LeaderLine.pointAnchor(endElement, { x: 0, y: 20 });

                  line.setOptions({
                    end: endPointAnchor,
                  });
                }
              }
            }
          }

          context.set('line', line);
        },

        redraw(context, { isActive, edge }) {
          if (isActive) {
            context.line.color = ACTIVE_GREY;
          } else {
            if (edge.isInitialEdge) {
              context.line.color = ACTIVE_GREY;
              return;
            }
            context.line.color = IDLE_GREY;
          }
        },
      },
    }
  ),

  didReceiveAttrs() {
    this._super(...arguments);

    const { startElement, endElement, edge, isActive } = getProperties(this, [
      'startElement',
      'endElement',
      'edge',
      'isActive',
    ]);

    this.statechart.send('DATA_RECEIVED', { startElement, endElement, edge, isActive });
  },

  willDestroyElement() {
    this.line && this.line.remove();

    this._super(...arguments);
  },
});
