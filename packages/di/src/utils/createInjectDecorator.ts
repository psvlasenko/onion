import 'reflect-metadata';

import { isFunction } from 'lodash';
import { either } from 'ramda';

import { Class } from '@onion/types';
import { isSymbol } from '@onion/utils';

import { DiContainer } from '../DiContainer';
import { nameOf } from './getComponentName';

const isTypeToken = either(isFunction, isSymbol);

export const createInjectDecorator = <T extends DiContainer>(di: T) => (target: object, key: string): void => {
    if (!(key in target)) {
        const injectedType = Reflect.getMetadata('design:type', target, key);

        Object.defineProperty(target, key, {
            get: () => {
                if (isTypeToken(injectedType)) {
                    if (di.has(injectedType)) {
                        return di.get(injectedType as unknown as Class);
                    }

                    const typeToken = nameOf(injectedType);

                    if (di.has(typeToken)) {
                        return di[typeToken];
                    }
                }

                return di[key];
            },
            enumerable: true,
            configurable: false,
        });
    }
};
