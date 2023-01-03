export const entriesFrom = <T, U>(map: { entries: () => IterableIterator<[T, U]> }): [T, U][] => [...map.entries()];
