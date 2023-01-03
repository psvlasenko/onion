export const forkJoinAsync = <T, U, V, X>(
    fn1: (arg: T) => U | Promise<U>,
    fn2: (arg: T) => V | Promise<V>,
    join: (res1: U, res2: V) => X,
) => (arg: T) => Promise.all([fn1(arg), fn2(arg)]).then(([res1, res2]) => join(res1, res2));
