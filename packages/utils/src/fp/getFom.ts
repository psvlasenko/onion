import { curry } from 'ramda';

const fn = <U extends { getIdentity(): unknown }>(
    repository: { get(id: ReturnType<U['getIdentity']>): Promise<U> },
    id: ReturnType<U['getIdentity']>,
) => repository.get(id);

export const getFrom = curry(fn);
