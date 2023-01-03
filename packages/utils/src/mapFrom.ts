import { uniqBy } from 'lodash';

import { Collection } from '@onion/types';

import { ErrorFactory, ExistenceCheckingMap } from './collections';
import { valuesFrom } from './valuesFrom';

export const mapFrom = <T extends object, U extends keyof T & string>(
    collection: Collection<T> ,
    key: U,
    errorFactory?: ErrorFactory<T[U]>,
): ExistenceCheckingMap<T[U], T> =>
    new ExistenceCheckingMap(uniqBy(valuesFrom(collection), key).map(it => [it[key], it]), errorFactory);
