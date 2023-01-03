import { isArray, isUndefined } from 'lodash';

import { Optional } from '@onion/types';

type AsArrayType = {
    <T>(value: Optional<T| T[]>): T[];
    <T>(value: Optional<T| ReadonlyArray<T>>): ReadonlyArray<T>;
};

const asArray: AsArrayType = value  => isUndefined(value) ? [] : isArray(value) ? value : [value];

export {
    asArray,
    AsArrayType,
};
