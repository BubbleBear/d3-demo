export default (simulation) => {
    const fileInput = document.querySelector('#avatar_upload');

    const preview = d3.select('.preview');

    let blob;

    d3.select('input[type=file]')
        .on('change', () => {
            const avatar = fileInput.files[0];
            blob = URL.createObjectURL(avatar);
            preview.property('src', blob)
        })

    d3.select('input[type=submit]')
        .on('click', () => {
            // simulation.stop();
            // simulation.nodes();

            // const name = document.querySelector('form > * > .name').value;

            // d3.selectAll('g.nodes')
            //     .append('circle')
            //     .attr('class', `person ${name}`)
            //     .attr('fill', `url(${blob})`)
            //     .attr('r', 35);

            // simulation.restart();
        })
};
