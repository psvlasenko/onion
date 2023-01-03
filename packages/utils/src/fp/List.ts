import { curry } from 'ramda';

type EmptyList = [];
type NotEmptyList<T> = [T, ...T[]] | T[];
type List<T> = EmptyList | NotEmptyList<T>;

const isEmpty = <T>(list: List<T>): list is EmptyList => list.length === 0;

namespace List {

    type Curried = {
        <T, U>(fn: (val: T) => U, arg: List<T>): List<U>;
        <T, U>(fn: (val: T) => U): (arg: List<T>) => List<U> ;
    };

    export const map: Curried = curry(<T, U>(
        fn: (arg: T) => U, val: List<T>): List<U> => isEmpty(val) ? val : val.map(it => fn(it)) as NotEmptyList<U>,
    );
}

export {
    List,
};
