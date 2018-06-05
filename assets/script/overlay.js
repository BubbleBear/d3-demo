const head = d3.select('head');
const body = d3.select('body');

export default (id) => {
    const { overlay, content } = buildOverlay();

    const tmp = d3.select(`#${id}`).classed('overlay-content', true).property('hidden', false);
    try {
        content.html(tmp.html());
    } catch (e) {}
    tmp.remove();

    style();

    d3.select('[show-overlay]')
        .on('mouseup', () => {
            overlay.property('hidden', false);
        });

    d3.select('[hide-overlay]')
        .on('mouseup', () => {
            overlay.property('hidden', true);
        })

    return content;
}

function buildOverlay() {
    const overlay = body
        .append('div')
        .attr('class', 'overlay-layout')
        .property('hidden', true);
    
    const mask = overlay
        .append('div')
        .attr('class', 'overlay-background')
        .append('div')
        .attr('class', 'overlay-mask')
        .on('click', () => {
            if (d3.event.target == mask._groups[0][0]) {
                overlay.property('hidden', true);
            }
        }, true);

    const content = mask
        .append('div')
        .attr('class', 'overlay-content');

    return { overlay, content };
}

function style() {
    head
        .append('style')
        .attr('type', 'text/css')
        .html(`
            .overlay-layout {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 99;
                overflow-y: auto;
                transition: opacity 0.2s ease-in-out;
            }

            .overlay-background {
                display: table;
                width: 100%;
                height: 100%;
                table-layout: fixed;
                background-color: rgba(0,0,0,0.5);
            }

            .overlay-mask {
                vertical-align: middle;
                display: table-cell;
                width: 100%;
                height: 100%;
                padding: 32px;
            }

            .overlay-content {
                border: 1px solid #d1d5da;
                border-radius: 3px;
                margin-right: auto;
                margin-left: auto;
                background-color: #fff;
                background-clip: padding-box;
                border-color: #444d56;
                box-shadow: 0 0 18px rgba(0,0,0,0.4);
            }
        `)
}
