import eventsWrapper from './events.js';
import overlay from './overlay.js';
import upload from './upload.js';
import view from './view.js';

class D3Demo {
    constructor(data) {
        // init the view, which must the the first method to call
        this.drawSvg = view(this);
        this.drawSvg(data);

        this.data = data;
        this.simulation = this.initSimulation();
        this.events = eventsWrapper(this);

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

    startSimulation(data, events) {
        this.simulation
            .nodes(data.nodes)
            .force('link', d3.forceLink()
                .id(v => v.id)
                .links(data.edges)
                .distance(this.radius * 10)
            )
            .on('tick', events.tick);
    }
    
    start() {
        const events = this.events;

        this.startSimulation(this.data, events);
    
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
