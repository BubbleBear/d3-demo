// 大部分视图的控制，包括SVG，右键下载菜单，左下角控制板

import createMenu from './menu.js';
import initPanel from './panel.js';

export default (ctx) => {
    const width = ctx.width = 1200;
    const height = ctx.height = 900;
    const radius = ctx.radius = 35;
    const fontSize = ctx.fontSize = 16;

    const svg = d3.select('svg#layout')
        .attr('width', width)
        .attr('height', height)
        .on('contextmenu', () => {
            download();
        });

    // 绘制节点
    function drawNodes(data) {
        svg.append('g')
            .classed('nodes', true);

        const mask = svg.select('g.nodes')
            .selectAll('circle.mask')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', v => `mask ${v.id}`)
            .attr('r', radius + 3)
            .attr('fill', 'white');

        const nodes = svg.select('g.nodes')
            .selectAll('circle.person')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', v => `person ${v.id}`)
            .attr('r', radius);

        return nodes.merge(mask);
    }
    
    // 绘制节点名称
    function drawNodeTexts(data) {
        const texts = svg.append('g')
            .classed('node-texts', true)
            .selectAll('text.person')
            .data(data)
            .enter()
            .append('text')
            .attr('class', v => `person ${v.id}`)
            .text(v => v.id)
            .attr('dx', v => {
                const length = v.id.length;
                return - length / 2 * fontSize;
            })
            .attr('dy', radius * 1.5)
            .attr('style', `font-size:${fontSize};`);
    
        return texts;
    }
    
    // 绘制边
    function drawEdges(data) {
        const edges = svg.append('g')
            .classed('edges', true)
            .selectAll('line.relation')
            .data(data)
            .enter()
            .append('line')
            .attr('class', v => `relation ${v.source.id || v.source} ${v.target.id || v.target}`);
    
        return edges;
    }
    
    // 绘制边名称
    function drawEdgeTexts(data) {
        const texts = svg.append('g')
            .classed('edge-texts', true)
            .selectAll('text.relation')
            .data(data)
            .enter()
            .append('text')
            .attr('class', v => `relation ${v.source.id || v.source} ${v.target.id || v.target}`)
            .text(v => v.relation);
    
        return texts;
    }
    
    // 绘制头像，包裹在def标签中，供节点fill属性使用
    function drawAvatars(data) {
        const avatars = svg.append('g')
            .classed('avatars', true)
            .selectAll('.avatars defs')
            .data(data)
            .enter()
            .append('defs')
            .append('pattern')
            .attr('width', 1)
            .attr('height', 1)
            .attr('id', v => `avatar${v.id}`)
            .append('image')
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('xlink:href', v => `${v.image ? `image/${v.image}` : v.url}`);
    
        return avatars;
    }

    // 右键下载
    async function download() {
        d3.event.preventDefault();
        const svg = document.querySelector('svg');
        const pos = d3.mouse(document.body);
    
        createMenu(pos, 'relation-force', {
            svg: await svgAsDataUri(svg),
            png: await svgAsPngUri(svg, {encoderType: 'image/png'}),
            jpeg: await svgAsPngUri(svg, {encoderType: 'image/jpeg'}),
        });
    }

    return function drawSvg(data) {
        svg.selectAll('*').remove();
        ctx.edges = drawEdges(data.edges);
        ctx.edgeTexts = drawEdgeTexts(data.edges);
        ctx.nodes = drawNodes(data.nodes);
        drawAvatars(data.nodes);
        ctx.nodes.attr('fill', v => `url(#avatar${v.id})`);
        ctx.nodeTexts = drawNodeTexts(data.nodes);
        initPanel();
    }
}