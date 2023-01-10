import { isString } from 'lodash';

import { Class } from '@onion/types';

import type { Logger } from '@onion/types';
import type { DiContainer } from '../DiContainer';

const handler: ProxyHandler<DiContainer> = {
    get(di: DiContainer, key: PropertyKey): unknown {

        if (!isString(key)) {
            return;
        }

        const component = di[key];

        if (component === undefined) {
            const contextClass = Object.getPrototypeOf(di).constructor.name;
            const logger = di['logger'] as Logger;

            if (logger !== undefined) {
                logger.debug(`Component with name: "${key.toString()}" is not defined in ${contextClass}`);
            } else {
                console.dir(`Component with name: ${key.toString()} is not defined in ${contextClass}`, { colors: true });
            }
        }

        return component;
    },
};

const createContextWithDebugProxy = <T extends DiContainer>(diClass: Class<T>, ...args: any[]): T =>
    new Proxy(new diClass(...args), handler) as T;

export {
    createContextWithDebugProxy,
};
