
import { flow } from 'lodash/fp';
import { Unary } from './types';

type ArgValue<T> = T extends Promise<infer U> ? U : T;

type Pipe = {
    <T extends unknown[], U>(fn: (...args: T) => U): (...arg: Parameters<typeof fn>) => U;
    <T extends unknown[], U, V>(fn1: (...args: T) => U, fn2: Unary<ArgValue<U>, V>): (...arg: T) =>
        U extends Promise<infer U> ? Promise<ArgValue<V>> : V;
    <T extends unknown[], U, V, W>(fn1: (...args: T) => U, fn2: Unary<ArgValue<U>, V>, fn3: Unary<ArgValue<V>, W>): (...arg: T) =>
        U extends Promise<unknown> ? Promise<ArgValue<W>> : V extends Promise<unknown> ? Promise<ArgValue<W>> : W;
    <T extends unknown[], U, V, W, X>(
        fn1: (...args: T) => U,
        fn2: Unary<ArgValue<U>, V>,
        fn3: Unary<ArgValue<V>, W>,
        fn4: Unary<ArgValue<W>, X>): (...arg: T) =>
            U extends Promise<unknown>
            ? Promise<ArgValue<X>>
            : V extends Promise<unknown>
                ? Promise<ArgValue<X>>
                : W extends Promise<unknown>
                    ? Promise<ArgValue<X>>
                    : X;
    <T extends unknown[], U, V, W, X, Y>(
        fn1: (...args: T) => U,
        fn2: Unary<ArgValue<U>, V>,
        fn3: Unary<ArgValue<V>, W>,
        fn4: Unary<ArgValue<W>, X>,
        fn5: Unary<ArgValue<X>, Y>): (...arg: T) =>
            U extends Promise<unknown>
                ? Promise<ArgValue<Y>>
                : V extends Promise<unknown>
                    ? Promise<ArgValue<Y>>
                    : W extends Promise<unknown>
                        ? Promise<ArgValue<Y>>
                        : X extends Promise<unknown>
                            ? Promise<ArgValue<Y>>
                            : Y;
    <T extends unknown[], U, V, W, X, Y, Z>(
        fn1: (...args: T) => U,
        fn2: Unary<ArgValue<U>, V>,
        fn3: Unary<ArgValue<V>, W>,
        fn4: Unary<ArgValue<W>, X>,
        fn5: Unary<ArgValue<X>, Y>,
        fn6: Unary<ArgValue<Y>, Z>): (...arg: T) =>
            U extends Promise<unknown>
                ? Promise<ArgValue<Y>>
                : V extends Promise<unknown>
                    ? Promise<ArgValue<Y>>
                    : W extends Promise<unknown>
                        ? Promise<ArgValue<Y>>
                        : X extends Promise<unknown>
                            ? Promise<ArgValue<Y>>
                            : Y extends Promise<unknown>
                                ? Promise<ArgValue<Z>>
                                : Z;
};

const wrap = <T, U>(fn: Unary<T, U>, thisArg?: any): (arg: T) =>  U | Promise<U> => (arg: T) =>
    arg instanceof Promise ? arg.then(res => fn.bind(thisArg)(res)) : fn.bind(thisArg)(arg);

const pipe: Pipe = (...fns: Unary[]) => (arg: any, thisArg?: any) => flow(fns.map(fn => wrap(fn, thisArg)))(arg);

export {
    pipe,
};
