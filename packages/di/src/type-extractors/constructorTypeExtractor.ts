import { isFunction } from 'lodash';

import { Class } from '@onion/types';

import { TypeExtractor } from '../types';

export const constructorTypeExtractor: TypeExtractor = obj =>
    isFunction(obj)
        ? [obj] as unknown as Class[]
        : [obj.constructor] as Class[];
