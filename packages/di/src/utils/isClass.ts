import { isFunction } from 'lodash';

import { Class } from '@onion/types';

export const isClass = <T>(arg: Class<T> | T): arg is Class<T> => isFunction(arg);
