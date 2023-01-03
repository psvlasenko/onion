
import { flow } from 'lodash/fp';

type UnaryFunc = (arg: any) => any;

const wrap = (fn: UnaryFunc, thisArg?: any) => (arg: any) =>
    new Promise((res, rej) => res(arg))
        .then(async() => thisArg ? fn.bind(thisArg)(await arg) : fn(await arg));

const asyncFlow = (arg: any, thisArg?: any) => async(...fns: UnaryFunc[]) => {
    const wrappedFns = fns.map(fn => wrap(fn, thisArg));

    return flow(wrappedFns)(await arg);
};

export {
    asyncFlow,
    UnaryFunc,
};
