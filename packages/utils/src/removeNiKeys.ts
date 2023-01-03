import lodash from 'lodash';

export const removeNilKeys = <T = object>(o: object): T =>
    lodash(o).omitBy(lodash.isNil).value() as unknown as T;
