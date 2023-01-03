import { cloneDeep, isUndefined, keys } from 'lodash';

import { Nullable } from '@onion/types';

type Result<T extends object> = { [key in keyof T]: undefined extends T[key]
    ? Nullable<Exclude<T[key], undefined>>
    : T[key] };

const undefinedToNull = <T extends object>(obj: T): Result<T> => {
    const transformed = cloneDeep(obj) as Result<T>;
    const objKeys = keys(transformed) as (keyof Result<T>)[];

    objKeys.forEach((key) => {
        if (isUndefined(transformed[key])) {
            transformed[key] = null as Result<T>[typeof key];
        }
    });

    return transformed;
};

export {
    undefinedToNull,
};
