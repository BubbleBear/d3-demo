export default (ctx) => {
    const fileInput = document.querySelector('#avatar_upload');
    const preview = d3.select('.preview');
    const name = document.querySelector('input.name');
    const relationContainer = d3.select('form div.relation-container');

    let blob;

    function appendOptions(target) {
        target
            .selectAll('option.relation')
            .remove();
            
        target
            .selectAll('option.relation')
            .data(ctx.data.nodes)
            .enter()
            .append('option')
            .classed('relation', true)
            .attr('value', v => v.id)
            .html(v => v.id);
    }

    function getRelations() {
        const dupSet = new Set();
        const relations = document.querySelectorAll('.relation-container > div.relation');
        return Array.prototype.map.call(relations, d => {
            const select = d.querySelector('select');
            let target = select[select.selectedIndex];
            target && (target = target.value);
            target = !dupSet.has(target) && dupSet.add(target) && target;
            const relation = d.querySelector('input').value;
            return target && relation && {
                source: name.value,
                target: target,
                relation,
            } || null;
        }).filter(v => v);
    }

    d3.select('img.icon.button.relation')
        .on('click', () => {
            const relation = relationContainer
                .append('div')
                .attr('class', 'relation wrap');

            const select = relation
                .append('select')
                .attr('class', 'relation');

            relation
                .append('input')
                .attr('class', 'relation')
                .attr('type', 'text');

            select
                .on('mousedown', () => {
                    appendOptions(select);
                })
        })

    d3.select('select.relation')
        .on('mousedown', () => {
            appendOptions(d3.select('select.relation'));
        })

    d3.select('input[type=file]')
        .on('change', () => {
            const avatar = fileInput.files[0];
            blob = URL.createObjectURL(avatar);
            preview.attr('xlink:href', blob)
        })

    d3.select('input[type=submit]')
        .on('click', () => {
            try {
                ctx.data.nodes.forEach(v => {
                    if (v.id === name.value) {
                        alert('名字重复，请更换');
                        throw new Error('');
                    }
                })

                const relations = getRelations();

                ctx.data.nodes = ctx.data.nodes.concat({
                    id: name.value,
                    url: blob,
                });

                ctx.data.edges = ctx.data.edges.concat(relations)

                ctx.drawSvg(ctx.data);
                ctx.startSimulation(ctx.data)
                ctx.registerEvents();
                
                ctx.simulation.alpha(0.9).restart();
            } catch (e) {}
        })
};
