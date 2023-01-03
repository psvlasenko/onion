import { isArray } from 'lodash';

export const isArrayOfNulls = (value: unknown): value is null[] => isArray(value) && value.every(it => it === null);
