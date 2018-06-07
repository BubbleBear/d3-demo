// 入口文件

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
        overlay('query');
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

        // 关系查询
        d3.select('div.query button')
            .on('click', () => {
                // 获取源和目标的ID
                const srcId = document.querySelector('.query.src').value;
                const targetId = document.querySelector('.query.tar').value;

                if (srcId === targetId) {
                    alert('请选择源头和目标不同的参数');
                    return;
                }

                // 使边集成为一种映射表，其结构为
                // {
                //     source1: [
                //         {
                //             target1: relation,
                //         },
                //         {
                //             target2: relation,
                //         },
                //         ...
                //     ],
                //     source2: [
                //         {
                //             target1: relation,
                //         },
                //         {
                //             target2: relation,
                //         },
                //         ...
                //     ]
                // }
                const map = this.data.edges.reduce((acc, cur) => {
                    const src = cur.source.id || cur.source;
                    const tar = cur.target.id || cur.target;
                    acc[src] || (acc[src] = {});
                    acc[tar] || (acc[tar] = {});
                    acc[src][tar] = cur.relation;
                    acc[tar][src] = cur.relation;
                    return acc;
                }, {});

                // 使用set数据结构以确保在关系中每个节点最多被访问一次
                const set = new Set([srcId]);
                // 队列，用来做BFS
                const queue = [{ key: srcId, trace: [] }];
                let cur;

                // BFS
                while (queue.length) {
                    cur = queue.shift();

                    if (!map[cur.key]) continue;

                    const tos = Object.getOwnPropertyNames(map[cur.key]);
                    delete map[cur.key];

                    // 找到目标时终止循环
                    if (tos.includes(targetId)) {
                        cur = {
                            key: targetId,
                            trace: cur.trace.concat([[cur.key, targetId]]),
                        };
                        break;
                    }
                    
                    tos.forEach(v => {
                        const obj = {
                            key: v,
                            trace: cur.trace.concat([[cur.key, v]]),
                        }
                        queue.push(obj);
                    });
                }

                // 高亮，及点击空白区域取消选中事件的注册
                if (cur.key !== targetId) {
                    alert(`'${srcId}'和'${targetId}'非连通`);
                } else {
                    cur.trace.forEach(v => {
                        d3.selectAll(`circle.${v[0]},circle.${v[1]}`).classed('highlight', true);
                        d3.selectAll(`line.relation.${v[0]}.${v[1]}`).classed('highlight', true);
                        d3.selectAll(`text.relation.${v[0]}.${v[1]}`).attr('style', 'visibility: visible; stroke: rgb(185, 9, 97);');
                    })

                    d3.selection().on('mouseup.cancelHighlight', () => {
                        cur.trace.forEach(v => {
                            d3.selectAll(`circle.${v[0]},circle.${v[1]}`).classed('highlight', false);
                            d3.selectAll(`line.relation.${v[0]}.${v[1]}`).classed('highlight', false);
                            d3.selectAll(`text.relation.${v[0]}.${v[1]}`).attr('style', false);
                        })
                        d3.selection().on('mouseup.cancelHighlight', null);
                    })
                }
            })
    
        upload(this);
    }
}

d3.json('relation.json').then(data => {
    (new D3Demo(data)).start();
})
