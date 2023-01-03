import { curry } from 'ramda';

type Func<T, R> = {
    (arg: T): R;
    (arg1: T, arg2?: any): R;
    (arg1: T, arg2?: any, arg3?: any): R;
};

type Curried= {
    <T, R>(fn: Func<T, R>, arg: T): R extends Promise<any> ? Promise<T> : T;
    <T, R>(fn: Func<T, R>): (arg: T) => R extends Promise<any> ? Promise<T> : T;
};

function fn<T, U extends T, R>(fn: Func<T, R>, arg: U):  R extends Promise<any> ? Promise<U> : U {
    const res = fn(arg);

    return (res instanceof Promise ? res.then(() => arg) : arg) as R extends Promise<any> ? Promise<U> : U;
}

export const tap: Curried = curry(fn);
