let width = 1200;
let height = 900;
let radius = 35;

const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const events = {
    drag: {
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

function initSimulation() {
    return d3.forceSimulation()
        .force('centering', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide()
            .radius(radius * 2)
            .strength(0.7))
        .force('many-body', d3.forceManyBody()
            .strength(-10)  // negative to push away, positive to draw each other
            .theta(0.9)     // dunno wtf is this
            .distanceMin(radius)
            .distanceMax(radius * 5))
}

function drawNodes(nodes) {
    return svg.append('g')
        .classed('nodes', true)
        .selectAll('circle.person')
        .data(nodes)
        .enter()
        .append('circle')
        .classed('person', true)
        .attr('r', radius)
}

function drawEdges(edges) {
    return svg.append('g')
        .classed('edges', true)
        .selectAll('line.relation')
        .data(edges)
        .enter()
        .append('line')
        .classed('relation', true)
}

function definePatterns(nodes) {
    return svg.append('g')
        .selectAll('defs')
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
        .attr('href', v => `assets/image/${v.image}`);
}

async function start() {
    const data = await d3.json('relation.json');

    let nodes = drawNodes(data.nodes);
    definePatterns(data.nodes);
    nodes.attr('fill', v => `url(#avatar${v.id})`);
    let edges = drawEdges(data.edges);

    const simulation = initSimulation();
    simulation
        .nodes(data.nodes)
        .force('link', d3.forceLink()
            .id(v => v.id)
            .links(data.edges)
        )
        .on('tick', events.tick(nodes, edges))
}

start();
