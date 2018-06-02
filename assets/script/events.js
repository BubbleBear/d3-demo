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
        tick: () => {
            const nodes = d3.selectAll('circle.person');
            const edges = d3.selectAll('line.relation');
            const nodeTexts = d3.selectAll('text.person');
            const edgeTexts = d3.selectAll('text.relation');
            const { clientWidth, clientHeight } = document.querySelector('svg');

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
                .attr('y2', v => v.target.y);

            nodeTexts
                .attr('x', v => v.x)
                .attr('y', v => v.y);

            edgeTexts
                .attr('x', v => (v.source.x + v.target.x) / 2)
                .attr('y', v => (v.source.y + v.target.y) / 2);
        },
        custom: {
            simupause() {
                simulation.stop();
            },
            simuresume() {
                simulation.restart();
            },
            showRelation(target, index, nodes) {
                d3.selectAll(`.relation.${target.id}`)
                    .classed('relation-show', true);
            },
            hideRelation(target, index, nodes) {
                d3.selectAll(`.relation.${target.id}`)
                    .classed('relation-show', false);
            },
            add(target, index, nodes) {},
            reset(target, index, nodes) {},
            remove(target, index, nodes) {
                const person = d3.selectAll(`.person.${target.id}`);
                const allAboutIt = d3.selectAll(`.${target.id}`);
                if (person.attr('class').includes('remove')) {
                    allAboutIt.remove();
                }
            },
            link(target, index, nodes) {},
        }
    };
};
