import lodash, { isUndefined } from 'lodash';

export const hasDefinedKeys = (o: object): boolean =>
    !lodash(o)
        .values()
        .filter(it => !isUndefined(it))
        .isEmpty();
