// 右下角控制板

export default () => {
    const garbageSet = [
        './image/icon/garbage.svg',
        './image/icon/garbage-cancel.svg',
    ];

    const add = d3.select('.panel .add');
    const reset = d3.select('.panel .reset');
    const remove = d3.select('.panel .remove');
    const path = d3.select('.panel .path');

    let removeFlag = 1;

    reset.on('click', () => {
        location.reload();
    });

    remove.on('click', (target, index, nodes) => {
        d3.selectAll('.person')
            .classed('remove', removeFlag);
        remove.attr('src', garbageSet[removeFlag]);
        removeFlag = (removeFlag + 1) % 2;
    });
}