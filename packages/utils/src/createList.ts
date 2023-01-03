import { times } from 'lodash';

type Factory<T> = {
    (...arg: [any?, ...any[]]): T;
};

const createList = <T>(create: Factory<T>, count = 10): T[] => times(count, () => create());

export {
    createList,
};
