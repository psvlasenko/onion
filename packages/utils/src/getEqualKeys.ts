import { keys, isEqual } from 'lodash';

export const getEqualKeys = <T extends object, U extends object>(obj: T, other: U):(keyof T & keyof U)[] =>
    (keys(obj) as (keyof T & keyof U)[]).filter(key => key in other && isEqual(obj[key], other[key]));
