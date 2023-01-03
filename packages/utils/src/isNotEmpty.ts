import { isEmpty } from 'lodash';

export const isNotEmpty = <T>(list?: readonly T[] | undefined): list is (T[] & [T, ...T[]]) => !isEmpty(list);
