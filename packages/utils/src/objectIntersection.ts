import { curry, pick } from 'ramda';

import { getEqualKeys } from './getEqualKeys';

type Carried = {
    <T extends object>(obj: T): <U extends object>(other: U) => T | U;
    <T extends object, U extends object>(obj: object, other: object): T | U;
};

const objectIntersection: Carried = curry(
    <T extends object, U extends object>(obj: T, other: U) => pick(getEqualKeys(obj, other), obj),
);

export {
    objectIntersection,
};
