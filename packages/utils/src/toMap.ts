import { first, groupBy, isEmpty, isFunction, toPairs } from 'lodash';

import { Class, Collection, Instance } from '@onion/types';

import { valuesFrom } from './valuesFrom';

export function toMap<T extends Object, U, C extends Class<Map<U, T[]>>>(
    collection: Collection<T>,
    keyFactory: (value: T) => U,
    cls?: C
): Instance<C>;
export function toMap<T extends Object, U extends keyof T & string, C extends Class<Map<T[U], T[]>>>(
    collection: Collection<T> ,
    key: U,
    cls?: C
): Instance<C>;
export function toMap<T extends Object, U extends keyof T & string, C extends Class<Map<any, T[]>>>(
    collection: Collection<T> ,
    keyOrFunc: U | ((value: T) => U),
    cls: C = Map as unknown as C,
): Instance<C> {
    const values = valuesFrom(collection);

    if (isEmpty(values)) {
        return new cls() as Instance<C>;
    }

    return isFunction(keyOrFunc)
        ? new cls(toPairs(groupBy(values, keyOrFunc)).map(([_, values]) => [keyOrFunc(first(values)!), values])) as Instance<C>
        : new cls(toPairs(groupBy(values, keyOrFunc))) as Instance<C>;
}
