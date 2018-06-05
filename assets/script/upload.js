export default (ctx) => {
    const fileInput = document.querySelector('#avatar_upload');

    const preview = d3.select('.preview');

    const name = document.querySelector('input.name');

    const select = document.querySelector('select.relations');
    const index = select.selectedIndex;
    const relationWith = select[index];

    let blob;

    d3.select('input[type=file]')
        .on('change', () => {
            const avatar = fileInput.files[0];
            blob = URL.createObjectURL(avatar);
            preview.property('src', blob)
        })

    d3.select('input[type=submit]')
        .on('click', () => {
            ctx.data.nodes = ctx.data.nodes.concat({
                id: name.value,
                url: blob,
            });

            ctx.drawSvg(ctx.data);
            ctx.startSimulation(ctx.data)
            ctx.registerEvents();
        })

    d3.select('input.relations[type=text]')
        .on('change', () => {
            console.log(relationWith)
        })
};
