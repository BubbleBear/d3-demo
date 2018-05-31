export default {
    drag: {
        start(node, index, nodeDomList) {
            ;
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
