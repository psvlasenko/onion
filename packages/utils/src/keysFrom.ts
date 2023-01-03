export const keysFrom = <T>(collection: { keys(): IterableIterator<T> }): T[] => [...collection.keys()];
