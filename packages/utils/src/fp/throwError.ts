import { curry } from 'ramda';

type Curried = {
    <T, U>(createError: (params: T) => U, params: T): never;
    <T, U>(createError: (params: T) => U): (params: T) => never;
};

export const throwError = curry(<T, U>(createError: (params: T) => U, params: T) => { throw createError(params); }) as Curried;
