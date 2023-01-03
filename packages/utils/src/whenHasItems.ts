import { isUndefined } from 'lodash';
import { curry, when } from 'ramda';
import { isNotEmpty } from './isNotEmpty';

type Curried = {
    <T, U>(f: (list: T[]) => U, val: T[]): U | [];
    <T, U>(f: (list: readonly T[]) => U, val: readonly T[]): U | [];
    <T, U>(f: (list: [T, ...T[]]) => U, val: T[]): U | [];
    <T, U>(f: (list: T[]) => U): (val: T[]) => U | [];
    <T, U>(f: (list: [T, ...T[]]) => U): (val: T[]) => U | [];
};

const whenHasItems: Curried = curry(
    <T, U>(f: (list: T[]) => U, val: T[] | undefined) => isUndefined(val) ? [] : when(isNotEmpty, f)(val),
);

export {
    whenHasItems,
};
