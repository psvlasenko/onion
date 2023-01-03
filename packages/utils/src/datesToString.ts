import format from 'date-fns/format';

import { DatesAsString } from '@onion/types';
import { isDefined } from './isDefined';
import { cloneDeep } from 'lodash';

const dateToString = (date: Date, formatStr?: 'yyyy-MM-dd') =>
    isDefined(formatStr)
        ? format(date, formatStr)
        : date.toJSON();

const datesToString = <T extends object>(obj: T): DatesAsString<T>  => {
    const cloned = cloneDeep(obj);

    const newEntries = Object.entries(cloned)
        .map(([key, value]) => [key, value instanceof Date ? dateToString(value) : value])

    return Object.fromEntries(newEntries);
};

export {
    datesToString,
};
