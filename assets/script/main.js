let width = 1200;
let height = 900;
let radius = 35;

const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const canvas = d3.select('body')
    .append('canvas')
    .attr('id', 'canvas')

const events = {
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

function drawAvatars(nodes) {
    return svg.append('g')
        .classed('avatars', true)
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

    // the order of drawing is essentiel, if nodes are drawn before edges
    // they will be overlapped by edges

    // draw edges
    let edges = drawEdges(data.edges);

    // draw nodes
    let nodes = drawNodes(data.nodes);

    // draw avatars
    drawAvatars(data.nodes);

    // attach avatars to nodes
    nodes.attr('fill', v => `url(#avatar${v.id})`);

    // init force simulation
    const simulation = initSimulation();

    // attach nodes and edges to simulation
    // plus attach event listeners to simulation
    simulation
        .nodes(data.nodes)
        .force('link', d3.forceLink()
            .id(v => v.id)
            .links(data.edges)
        )
        .on('tick', events.tick(nodes, edges));

    // invoke download menu
    svg.on('contextmenu', (...args) => {
        d3.event.preventDefault();
        const pos = d3.mouse(document.body);

        canvg('canvas', document.querySelector('svg').outerHTML, {
            log: true,
            ignoreMouse: true,
            ignoreAnimation: true,
            ingoreClear: true,
            useCORS: true,
        })

        // html2canvas(document.body, {
        //     allowTaint: true,
        // }).then(canvas => {
        //     document.body.appendChild(canvas)
        // });
    })
}

start();
