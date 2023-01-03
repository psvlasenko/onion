import { compact } from 'lodash';
import { compose, uniq } from 'ramda';

import { KeyOwner, OwnerOf } from '@onion/types';

import { Optional } from './fp/Optional';
import { mapKey } from './mapKey';

type RequitedValueOf<T extends string, U> = U extends OwnerOf<T> ? U[T] extends Optional<infer V> ? V : U[T] : never;

export const mapUniqKey = <T extends string>(key: T)  =>
    <U extends KeyOwner<T>>(list: U[]): RequitedValueOf<T, U>[] =>
    compose<U[], Optional<U[T]>[], U[T][], U[T][]>(uniq, compact, mapKey(key))(list) as RequitedValueOf<T, U>[];
