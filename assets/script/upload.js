// 添加节点时上传文件的处理，大部分都是表单处理

export default (ctx) => {
    const fileInput = document.querySelector('#avatar_upload');
    const preview = d3.select('.preview');
    const name = document.querySelector('input.name');
    const relationContainer = d3.select('form div.relation-container');

    let blob;

    // 下拉框点击时动态加载，以保证新加入的节点也可被选择
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
        .on('click.upload.relation', () => {
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
                .on('mousedown.upload.relation', () => {
                    appendOptions(select);
                })
        })

    d3.selectAll('select.relation')
        .on('mousedown.upload.relation', () => {
            appendOptions(d3.select(d3.event.target));
        })

    d3.select('input[type=file]')
        .on('change.upload.file', () => {
            const avatar = fileInput.files[0];
            blob = URL.createObjectURL(avatar);
            preview.attr('xlink:href', blob)
        })

    d3.select('input[type=submit]')
        .on('click.upload.submit', () => {
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
