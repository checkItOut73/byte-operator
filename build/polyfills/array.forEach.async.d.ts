interface Array<T> {
    forEachAsync(func: (item: T) => void): void;
    forEachAsyncParallel(func: (item: T) => void): void;
}
