import { isNull, cloneDeep } from 'lodash';

type Result<T extends object> = { [key in keyof T]: null extends T[key] ? undefined : T[key] };

const nullToUndefined = <T extends object>(obj: T): Result<T> => {
    const cloned = cloneDeep(obj);

    const newEntries = Object.entries(cloned)
        .map(([key, value]) => [key, isNull(value) ? undefined : value])

    return Object.fromEntries(newEntries);
};

export {
    nullToUndefined,
};
