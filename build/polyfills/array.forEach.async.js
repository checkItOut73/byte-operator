Array.prototype.forEachAsync = async function(func) {
    for (let item of this) {
        await func(item);
    }
};

Array.prototype.forEachAsyncParallel = async function(func) {
    await Promise.all(this.map(func));
};
