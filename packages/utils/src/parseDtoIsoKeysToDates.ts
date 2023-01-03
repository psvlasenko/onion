import { fromPairs, isArray, isBoolean, isDate, isFunction, isNil, isNumber, isObject, toPairs } from 'lodash';

import { Validation } from './validation/Validation';

function parseDtoIsoKeysToDates<T>(obj: { [key in keyof T]: any }): T {
    const pairs = toPairs(obj);
    const newPairs = pairs.map(([key, value]) => [key, parseIso(value)]);

    return fromPairs(newPairs) as unknown as T;
}

function parseIso(value: any): any {
    if (
        isNumber(value)
        || isBoolean(value)
        || isFunction(value)
        || isNil(value)
        || isDate(value)
    ) {
        return value;
    }

    if (Validation.isIso(value)) {
        return new Date(value);
    }

    if (isArray(value)) {
        return value.map(it => parseIso(it));
    }

    if (isObject(value)) {
        const pairs = toPairs(value);
        const newPairs = pairs.map(([key, value]) => [key, parseIso(value)]);

        return fromPairs(newPairs);
    }

    return value;
}

export {
    parseDtoIsoKeysToDates,
};
