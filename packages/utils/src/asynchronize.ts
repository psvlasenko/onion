export const asynchronize = <T>(fn: (arg?: any) => T): Promise<T> => new Promise(resolve => process.nextTick(() => resolve(fn())));
