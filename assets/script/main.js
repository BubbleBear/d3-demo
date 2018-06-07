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

        // 使#add和#target变为模态框内容
        overlay('add');
        overlay('target');
    }

    // 初始化力图模拟，在D3 V5里是用这种方式
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

    // 将点和边传入力图模拟，D3 V5里边是添加在力上面的
    startSimulation(data) {
        this.simulation
            .nodes(data.nodes)
            .force('link', d3.forceLink()
                .id(v => v.id)
                .links(data.edges)
                .distance(this.radius * 10)
            )
            .on('tick', this.events.tick);
    }

    // 注册节点的各种事件，比如拖曳，鼠标悬停，点击等等
    registerEvents() {
        this.nodes.call(d3.drag()
            .on('start', this.events.drag.start)
            .on('drag', this.events.drag.drag)
            .on('end', this.events.drag.end))
            .on('mouseenter', this.events.custom.showRelation)
            .on('mouseleave', this.events.custom.hideRelation)
            .on('click', this.events.custom.remove);
    }
    
    start() {
        this.startSimulation(this.data);
    
        this.registerEvents();
    
        d3.select('body')
            .on('simupause', this.events.custom.simuPause)
            .on('simuresume', this.events.custom.simuResume);

        d3.select('div.target button')
            .on('click', () => {
                const id = document.querySelector('div.target input').value;
                let a = d3.selectAll(`text.relation.${id}`)
                    .classed('relation-show', true);

                let b = d3.selectAll(`.mask.${id},.relation.${id}`)
                    .classed('highlight', true);

                d3.selection().on('mouseup', () => {
                    a.classed('relation-show', false);
                    b.classed('highlight', false);
                    d3.selection().on('mouseup', null);
                })
            })
    
        upload(this);
    }
}

d3.json('relation.json').then(data => {
    (new D3Demo(data)).start();
})
