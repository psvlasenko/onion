import { omit } from 'lodash';

import { getEqualKeys } from './getEqualKeys';

const objectDifference = <T extends object>(obj: T, other: object): Partial<T> =>
    omit(obj, getEqualKeys(obj, other));

export {
    objectDifference
}
