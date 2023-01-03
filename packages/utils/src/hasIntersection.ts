import { curry } from 'ramda';
import { isEmpty, isObject } from 'lodash';

import { getEqualKeys } from './getEqualKeys';

type Curried = {
    <T, U>(o1: T, o2: U): boolean;
    <T>(o1: T): <U>(o2: U) => boolean;
};

const hasIntersection: Curried = curry(<T, U>(o1: T, o2: U) => isObject(o1) && isObject(o2) && !isEmpty(getEqualKeys(o1, o2)));

export {
    hasIntersection,
};
