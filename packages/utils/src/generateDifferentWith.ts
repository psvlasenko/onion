import { isEmpty } from 'lodash';

import { objectDifference } from './objectDifference';

export function generateDifferentWith<T extends object>(obj: object, generate: (arg?: unknown) => T): Partial<T> {
    const params = generate();
    const result = objectDifference(params, obj);

    return !isEmpty(result) ? result : generateDifferentWith(obj, generate);
}
