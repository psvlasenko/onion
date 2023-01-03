export const forkJoin = <T, U, V, X>(
    fn1: (arg: T) => U,
    fn2: (arg: T) => V,
    join: (res1: U, res2: V) => X,
) => (arg: T) => join(fn1(arg), fn2(arg));
