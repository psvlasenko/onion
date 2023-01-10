import { curry } from 'ramda';

import type { Class } from '@onion/types';
import type { DiContainer } from './DiContainer';

type CreateInjectable = <T, U extends unknown[]>(
    di: DiContainer,
    cls: Class<T, unknown[]>,
    ...params: U
) => T;

const create: CreateInjectable = (di, cls, ...params) => {
    const instance = new cls(...params);
    di.inject(instance);

    return instance;
}

type Curried = {
    <T, U extends unknown[]>(ctx: DiContainer, ctor: Class<T, U>, ...params: U): T;
    (ctx: DiContainer): <T, U extends unknown[]>(ctor: Class<T, U>, ...params: U) => T;
    (ctx: DiContainer): <T, U extends unknown[]>(ctor: Class<T, U>) => (...params: U) => T;
};

const createInjectable: Curried = curry(create);

export {
    createInjectable,
};
