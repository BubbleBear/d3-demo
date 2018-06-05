export default (ctx) => {
    const fileInput = document.querySelector('#avatar_upload');
    const preview = d3.select('.preview');
    const name = document.querySelector('input.name');
    const relationContainer = d3.select('form div.relation-container');
    const relationsSelect = document.querySelector('select.relation');
    const relationsInput = document.querySelector('input.relation');

    let blob;

    function appendOptions() {
        d3.selectAll('select.relation')
            .selectAll('option.relation')
            .remove();
            
        d3.selectAll('select.relation')
            .selectAll('option.relation')
            .data(ctx.data.nodes)
            .enter()
            .append('option')
            .classed('relation', true)
            .attr('value', v => v.id)
            .html(v => v.id);
    }

    function getRelations() {
        const index = relationsSelect.selectedIndex;
        const relationsTarget= relationsSelect[index].value;
        const relationsName = relationsInput.value;
        return { target: relationsTarget, relation: relationsName }
    }

    d3.select('img.icon.button.relation')
        .on('click', () => {
            const relation = relationContainer
                .append('div')
                .attr('class', 'relation')
        })

    d3.select('select.relation')
        .on('mousedown', () => {
            appendOptions();
        })

    d3.select('input[type=file]')
        .on('change', () => {
            const avatar = fileInput.files[0];
            blob = URL.createObjectURL(avatar);
            preview.property('src', blob)
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

                const relation = getRelations();

                ctx.data.nodes = ctx.data.nodes.concat({
                    id: name.value,
                    url: blob,
                });

                ctx.data.edges = ctx.data.edges.concat({
                    source: name.value,
                    target: relation.target,
                    relation: relation.relation,
                })

                ctx.drawSvg(ctx.data);
                ctx.startSimulation(ctx.data)
                ctx.registerEvents();
                
                ctx.simulation.alpha(0.9).restart();
            } catch (e) {}
        })
};
