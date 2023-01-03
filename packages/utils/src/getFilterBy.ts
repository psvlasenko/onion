import { isUndefined } from 'lodash';
import { isArray } from 'lodash/fp';

export function getFilterBy<T extends object, K extends keyof T & string>(
    key: K & string,
    value?: T[K] | T[K][],
): (list: T[]) => T[] {
    return (list: T[]) => {
        if (isUndefined(value)) {
            return list;
        }

        if (isArray(value)) {
            return list.filter(it => value.includes(it[key]));
        }

        return list.filter(it => it[key] === value);
    };
}
