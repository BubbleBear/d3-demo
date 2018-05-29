let width = 960;
let height = 600;
let radius = 30;

const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const events = {
    drag: {
    },
};

function initSimulation() {
    return d3.forceSimulation()
        .force('centering', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide()
            .radius(radius)
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
        .selectAll('.avatar')
        .data(nodes)
        .enter()
        .append('circle')
        .classed('avatar', true)
        .attr('r', radius)
        .attr('fill-opacity', 0.5)
}

async function start() {
    const data = await d3.json('relation.json');

    const simulation = initSimulation();

    let nodes = drawNodes(data.nodes);

    nodes.append('image')
        .attr('href', v => `assets/image/${v.image}`)
        .attr('width', radius)
        .attr('height', radius)

    simulation
        .nodes(data.nodes)
        .on('tick', () => {
            nodes
                .attr('cx', v => v.x)
                .attr('cy', v => v.y)
        })
}

start();
