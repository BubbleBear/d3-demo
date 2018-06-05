export default (ctx) => {
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
            ctx.data.nodes = ctx.data.nodes.concat(ctx.data.nodes)

            ctx.startSimulation(ctx.data, ctx.events)
        })
};
