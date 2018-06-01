export default (simulation) => {
    return {
        drag: {
            start(target, index, nodes) {
                d3.select(this)
                    .classed('dragging', true)
            },
            drag(target, index, nodes) {
                simulation
                    .alphaTarget(0)
                    .restart();

                d3.select(this)
                    .attr('cx', target.x = d3.event.x)
                    .attr('cy', target.y = d3.event.y)
            },
            end(target, index, nodes) {
                simulation
                    .alphaTarget(0)
                    .restart();

                d3.select(this)
                    .classed('dragging', false)
            },
        },
        tick: (nodes, edges) => {
            const { clientWidth, clientHeight } = document.querySelector('svg');

            return () => {
                nodes
                    .attr('cx', (target, index, nodes) => {
                        target.x < 0 && (target.x = 0)
                            || target.x > clientWidth && (target.x = clientWidth);
                        return target.x;
                    })
                    .attr('cy', (target, index, nodes) => {
                        target.y < 0 && (target.y = 0)
                            || target.y > clientHeight && (target.y = clientHeight);
                        return target.y;
                    });

                edges
                    .attr('x1', v => v.source.x)
                    .attr('y1', v => v.source.y)
                    .attr('x2', v => v.target.x)
                    .attr('y2', v => v.target.y)
            }
        },
        custom: {
            simupause() {
                simulation.stop();
            },
            simuresume() {
                simulation.restart();
            }
        }
    };
};
