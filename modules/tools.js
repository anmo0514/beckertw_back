const getDimensions = (arr) => {
    return [
        arr.length,
        arr.reduce((x, y) => Math.max(x, y.length), 0)
    ];
}

module.exports = {
    getDimensions,
}