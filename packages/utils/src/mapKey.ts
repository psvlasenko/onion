import { curry, prop } from 'ramda';
import { isUndefined } from 'lodash';

import { KeyOwner } from '@onion/types';

import { Optional } from './fp/Optional';

type Curried = {
    <T extends string, U extends KeyOwner<T>>(key: Optional<T>, source: Optional<U[]>): U[T][];
    <T extends string>(key: T): <U extends KeyOwner<T>>(source: Optional<U[]>) => U[T][];
};

const mapKey: Curried = curry(
    <T extends string, U extends KeyOwner<T>>(key: Optional<T>, source: Optional<U[]>) =>
        isUndefined(key) || isUndefined(source) ? [] : source.map(prop(key))
);

export {
    mapKey,
};
