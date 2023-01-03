import { Collection } from '@onion/types';

export const valuesFrom = <T>(collection: Collection<T>): T[] => [...collection.values()];
