export default () => {
    const garbageSet = [
        './image/icon/garbage.svg',
        './image/icon/garbage-cancel.svg',
    ];

    const add = d3.select('.panel .add');
    const reset = d3.select('.panel .reset');
    const remove = d3.select('.panel .remove');
    const path = d3.select('.panel .path');

    const persons = d3.selectAll('.person');
    const relations = d3.selectAll('.relation');

    let removeFlag = 1;

    remove.on('click', (target, index, nodes) => {
        persons.classed('remove', removeFlag);
        remove.attr('src', garbageSet[removeFlag]);
        removeFlag = (removeFlag + 1) % 2;
    });
}