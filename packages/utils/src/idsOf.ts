import { isEmpty, map } from 'lodash';

import { Collection } from '@onion/types';

import { Identifiable } from './types';

export const idsOf = <T>(col: Collection<Identifiable<T>>): T[] => {
    const values = [...col.values()];

    return isEmpty(values) ? [] : map(values, 'id');
};
