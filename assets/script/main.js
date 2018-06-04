import eventsWrapper from './events.js';
import createMenu from './menu.js';
import initPanel from './panel.js';
import overlay from './overlay.js';
import upload from './upload.js';

class D3Demo {
    constructor(data) {
        this.width = 1200;
        this.height = 900;
        this.radius = 35;
        this.fontSize = 16;

        this.svg = d3.select('body')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .on('contextmenu', () => {
                this.download();
            });

        this.simulation = this.initSimulation();
        this.events = eventsWrapper(this);

        this.data = data;
        this.edges = this.drawEdges(data.edges);
        this.edgeTexts = this.drawEdgeTexts(data.edges);
        this.nodes = this.drawNodes(data.nodes);
        this.drawAvatars(data.nodes);
        this.nodes.attr('fill', v => `url(#avatar${v.id})`);
        this.nodeTexts = this.drawNodeTexts(data.nodes);

        initPanel();
    
        overlay('modal');
    }

    initSimulation() {
        return d3.forceSimulation()
            .force('centering', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide()
                .radius(this.radius * 1.05)
                .strength(0.7)
            )
            .force('many-body', d3.forceManyBody()
                .strength(-10)  // negative to push away, positive to draw each other
                .theta(0.9)     // dunno wtf is this
                .distanceMin(1)
                .distanceMax(Infinity)
            )
    }
    
    drawNodes(data) {
        const nodes = this.svg.append('g')
            .classed('nodes', true)
            .selectAll('circle.person')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', v => `person ${v.id}`)
            .attr('r', this.radius);
    
        return nodes;
    }
    
    drawNodeTexts(data) {
        const texts = this.svg.append('g')
            .classed('node-texts', true)
            .selectAll('text.person')
            .data(data)
            .enter()
            .append('text')
            .attr('class', v => `person ${v.id}`)
            .text(v => v.id)
            .attr('dx', v => {
                const length = v.id.length;
                return - length / 2 * this.fontSize;
            })
            .attr('dy', this.radius * 1.5)
            .attr('style', `font-size:${this.fontSize};`);
    
        return texts;
    }
    
    drawEdges(data) {
        console.log(data)
        const edges = this.svg.append('g')
            .classed('edges', true)
            .selectAll('line.relation')
            .data(data)
            .enter()
            .append('line')
            .attr('class', v => {
                console.log(v.source, v.target)
                return `relation ${(v.source.id)} ${(v.target.id)}`
            });
    
        return edges;
    }
    
    drawEdgeTexts(data) {
        const texts = this.svg.append('g')
            .classed('edge-texts', true)
            .selectAll('text.relation')
            .data(data)
            .enter()
            .append('text')
            .attr('class', v => `relation ${(v.source.id)} ${(v.target.id)}`)
            .text(v => v.relation);
    
        return texts;
    }
    
    drawAvatars(nodes) {
        const avatars = this.svg.append('g')
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
            .attr('width', this.radius * 2)
            .attr('height', this.radius * 2)
            .attr('xlink:href', v => `image/${v.image}`);
    
        return avatars;
    }
    
    async download() {
        d3.event.preventDefault();
        const svg = document.querySelector('svg');
        const pos = d3.mouse(document.body);
    
        createMenu(pos, 'relation-force', {
            svg: await svgAsDataUri(svg),
            png: await svgAsPngUri(svg, {encoderType: 'image/png'}),
            jpeg: await svgAsPngUri(svg, {encoderType: 'image/jpeg'}),
        });
    }
    
    async start() {
        const data = this.data;
        const events = this.events;
        
        this.simulation
            .nodes(data.nodes)
            .force('link', d3.forceLink()
                .id(v => v.id)
                .links(data.edges)
                .distance(this.radius * 10)
            )
            .on('tick', events.tick);
    
        this.nodes.call(d3.drag()
            .on('start', events.drag.start)
            .on('drag', events.drag.drag)
            .on('end', events.drag.end))
            .on('mouseenter', events.custom.showRelation)
            .on('mouseleave', events.custom.hideRelation)
            .on('click', events.custom.remove)
    
        d3.select('body')
            .on('simupause', events.custom.simuPause)
            .on('simuresume', events.custom.simuResume)
    
        upload(this);
    }
}

d3.json('relation.json').then(data => {
    (new D3Demo(data)).start();
})
