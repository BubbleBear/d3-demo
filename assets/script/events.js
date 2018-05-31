export default {
    drag: {
        start(target, index, nodes) {
            d3.select(this)
                .classed('dragging', true)
        },
        drag(target, index, nodes) {
            const x = d3.select(this)
                .raise()
                .attr('cx', target.x = d3.event.x)
                .attr('cy', target.y = d3.event.y)
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
