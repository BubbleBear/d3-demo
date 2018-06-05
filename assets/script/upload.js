export default (ctx) => {
    const fileInput = document.querySelector('#avatar_upload');
    const preview = d3.select('.preview');
    const name = document.querySelector('input.name');
    const relationsSelect = document.querySelector('select.relations');
    const relationsInput = document.querySelector('input.relations');

    let blob;

    function appendOptions() {
        d3.selectAll('select.relations')
            .selectAll('option.relations')
            .remove();
            
        d3.selectAll('select.relations')
            .selectAll('option.relations')
            .data(ctx.data.nodes)
            .enter()
            .append('option')
            .classed('relations', true)
            .attr('value', v => v.id)
            .html(v => v.id);
    }

    function getRelations() {
        const index = relationsSelect.selectedIndex;
        const relationsTarget= relationsSelect[index].value;
        const relationsName = relationsInput.value;
        return { target: relationsTarget, relation: relationsName }
    }

    d3.select('select.relations')
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
            const relations = getRelations();

            ctx.data.nodes = ctx.data.nodes.concat({
                id: name.value,
                url: blob,
            });

            ctx.data.edges = ctx.data.edges.concat({
                source: name.value,
                target: relations.target,
                relation: relations.relation,
            })

            ctx.drawSvg(ctx.data);
            ctx.startSimulation(ctx.data)
            ctx.registerEvents();
            
            ctx.simulation.alpha(0.9).restart();
        })
};
