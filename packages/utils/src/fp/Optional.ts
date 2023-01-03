import { isUndefined } from 'lodash';
import { curry } from 'ramda';

type Optional<T> = T | undefined;

namespace Optional {

    type CurriedMap = {
        <T, U>(fn: (val: T) => U, arg: Optional<T>): U | undefined;
        <T, U>(fn: (val: T) => U): (arg: Optional<T>) => U | undefined;
    };

    type CurriedAp = {
        <T, U>(fn: Optional<(val: T) => U>, arg: Optional<T>): U | undefined;
        <T, U>(fn: Optional<(val: T) => U>): (arg: Optional<T>) => U | undefined;
    };

    export const map: CurriedMap = curry(<T, U>(fn: (arg: T) => U, val: Optional<T>): U | undefined => isUndefined(val) ? undefined : fn(val));
    export const ap: CurriedAp = curry(<T, U>(fn: Optional<(arg: T) => U>, val: Optional<T>): U | undefined =>
        isUndefined(val) || isUndefined(fn) ? undefined : fn(val));
}

export {
    Optional,
};
