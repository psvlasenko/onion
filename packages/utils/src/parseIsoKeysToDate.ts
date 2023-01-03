import { isString } from 'lodash';

import { Validation } from './validation/Validation';

export const parseIsoKeysToDate = <T>(obj: { [key in keyof T]: any }): T => {
    const parsedEntries = Object
        .entries(obj)
        .map(([key, value]) => [key, isString(value) && Validation.isIso(value) ? new Date(value) : value]);

    return Object.fromEntries(parsedEntries);
};
