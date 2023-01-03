import { isDate, isFunction, isNil, isString } from 'lodash';

export const sqlValuesString = (...args: any[]) =>
    `(${args.map(it => isFunction(it) ? it() : isNil(it) ? `null` : isString(it) ? `'${it.replace('\'', '\'\'')}'` : isDate(it) ? `'${it.toISOString()}'` : it.toString()).join(',')})`;
