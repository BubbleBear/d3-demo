import eventsWrapper from './events.js';
import createMenu from './menu.js';
import initPanel from './panel.js';
import overlay from './overlay.js';
import upload from './upload.js';

const width = 1200;
const height = 900;
const radius = 35;
const fontSize = 16;

const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

function initSimulation() {
    return d3.forceSimulation()
        .force('centering', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide()
            .radius(radius * 1.05)
            .strength(0.7)
        )
        .force('many-body', d3.forceManyBody()
            .strength(-10)  // negative to push away, positive to draw each other
            .theta(0.9)     // dunno wtf is this
            .distanceMin(1)
            .distanceMax(Infinity)
        )
}

function drawNodes(data) {
    const nodes = svg.append('g')
        .classed('nodes', true)
        .selectAll('circle.person')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', v => `person ${v.id}`)
        .attr('r', radius);

    return nodes;
}

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

function drawEdges(data) {
    const edges = svg.append('g')
        .classed('edges', true)
        .selectAll('line.relation')
        .data(data)
        .enter()
        .append('line')
        .attr('class', v => `relation ${(v.source.id)} ${(v.target.id)}`);

    return edges;
}

function drawEdgeTexts(data) {
    const texts = svg.append('g')
        .classed('edge-texts', true)
        .selectAll('text.relation')
        .data(data)
        .enter()
        .append('text')
        .attr('class', v => `relation ${(v.source.id)} ${(v.target.id)}`)
        .text(v => v.relation);

    return texts;
}

function drawAvatars(nodes) {
    const avatars = svg.append('g')
        .classed('avatars', true)
        .selectAll('.avatars defs')
        .data(nodes)
        .enter()
        .append('defs')
        .append('pattern')
        .attr('width', 1)
        .attr('height', 1)
        .attr('id', v => `avatar${v.id}`)
        .append('image')
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .attr('xlink:href', v => `image/${v.image}`);

    return avatars;
}

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

async function start() {
    const data = await d3.json('relation.json');

    // init force simulation
    const simulation = initSimulation();

    const events = eventsWrapper(simulation);

    // attach nodes and edges to simulation
    // plus attach event listeners to simulation
    simulation
        .nodes(data.nodes)
        .force('link', d3.forceLink()
            .id(v => v.id)
            .links(data.edges)
            .distance(radius * 10)
        )
        .on('tick', events.tick);

    // the order of drawing is essentiel, if nodes are drawn before edges
    // they will be overlapped by edges

    // draw edges
    let edges = drawEdges(data.edges);
    drawEdgeTexts(data.edges);

    // draw nodes
    let nodes = drawNodes(data.nodes);
    drawNodeTexts(data.nodes);

    // draw avatars
    drawAvatars(data.nodes);

    // attach avatars to nodes
    nodes.attr('fill', v => `url(#avatar${v.id})`);

    nodes.call(d3.drag()
        .on('start', events.drag.start)
        .on('drag', events.drag.drag)
        .on('end', events.drag.end))
        .on('mouseenter', events.custom.showRelation)
        .on('mouseleave', events.custom.hideRelation)
        .on('click', events.custom.remove)

    // register linstener for download
    svg.on('contextmenu', () => {
        // invoke download menu
        download();
    })

    d3.select('body')
        .on('simupause', events.custom.simuPause)
        .on('simuresume', events.custom.simuResume)

    initPanel();

    overlay('modal');

    upload(simulation);
}

start();
