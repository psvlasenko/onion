import { curry, prop } from 'ramda';

import { ItemOf, KeyOwner } from '@onion/types';

import { Optional } from './fp/Optional';
import { isUndefined } from 'lodash';

type Curried = {
    <T extends string, U extends KeyOwner<T>>(key: Optional<T>, source: Optional<U[]>): ItemOf<U[T]>[];
    <T extends string>(key: T): <U extends KeyOwner<T>>(source: Optional<U[]>) => ItemOf<U[T]>[];
};

export const flatMapKey: Curried = curry(<T extends string, U extends KeyOwner<T>>(key: Optional<T>, source: Optional<U[]>) =>
    isUndefined(key) || isUndefined(source) ? [] : source.flatMap(prop(key)));
