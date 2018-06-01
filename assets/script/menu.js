const css = `.download-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: inline-block;
  float: left;
  min-width: 160px;
  padding: 5px 0;
  margin: 2px 0 0;
  list-style: none;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #ccc;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: 4px;
  -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-clip: padding-box;
}

.download-menu>li>a {
  display: block;
  padding: 3px 20px;
  clear: both;
  font-weight: 400;
  line-height: 1.42857143;
  color: #333;
  white-space: nowrap;
  text-decoration: none;
  background: 0 0;
}

.download-menu>li>a:hover, .download-menu>li>a:focus {
  text-decoration: none;
  color: #262626;
  background-color: #f5f5f5;
}`

export default (pos, filename, listMap) => {
    if (d3.select('#downloadable-css').empty()) {
        d3.select('head')
            .append('style')
            .attr('id', 'downloadable-css')
            .text(css)
    }
    
    const menu = d3.select('body')
        .append('ul')
        .classed('download-menu', true)
        .style('left', `${pos[0]}px`)
        .style('top', `${pos[1]}px`)
        .on('mouseleave', () => {
            menu.remove();
            d3.dispatch('menustop');
        })
        .dispatch('menustart', {
            bubbles: true,
        });
        
    const list = menu
        .append('li')

    Object.entries(listMap).forEach(v => {
        list
            .append('a')
            .text(`Save as ${v[0]}`)
            .attr('download', `${filename}.${v[0]}`)
            .attr('href', v[1]);
    });
}
