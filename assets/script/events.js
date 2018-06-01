export default (ctx) => {
    return {
        drag: {
            start(target, index, nodes) {
                ctx.alphaTarget(0.3).restart();
                d3.select(this)
                    .classed('dragging', true)
            },
            drag(target, index, nodes) {
                const { clientWidth, clientHeight } = document.body;

                // restrict drag area within client
                if (d3.event.x > clientWidth
                    || d3.event.x < 0
                    || d3.event.y > clientHeight
                    || d3.event.y < 0) {
                    return;
                }

                d3.select(this)
                    .attr('cx', target.fx = d3.event.x)
                    .attr('cy', target.fy = d3.event.y)
            },
            end(target, index, nodes) {
                d3.select(this)
                    .classed('dragging', false)
            },
        },
        tick: (nodes, edges) => {
            return () => {
                nodes
                    .attr('cx', v => v.x)
                    .attr('cy', v => v.y);

                edges
                    .attr('x1', v => v.source.x)
                    .attr('y1', v => v.source.y)
                    .attr('x2', v => v.target.x)
                    .attr('y2', v => v.target.y)
            }
        },
    };
};
