import { curry, isNil } from 'lodash';

import { AbstractClass } from '@onion/types';

import { getMarkers } from './markAs';

const fn = (classAsInterface: AbstractClass<any>, target: any) => isNil(target)  ? false : getMarkers(target).has(classAsInterface);
const isMarkedAs = curry(fn);

export {
    isMarkedAs,
};
