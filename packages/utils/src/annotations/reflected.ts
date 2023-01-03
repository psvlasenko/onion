import 'reflect-metadata';

import { Class } from '@onion/types';

const metadataKey = '__property_name:type_map__';

const reflected: PropertyDecorator = (target: object, key: string | symbol) => {
    if (!Reflect.hasMetadata(metadataKey, target)) {
        Reflect.defineMetadata(metadataKey, new Map(), target);
    }

    const interfaceOrClass: Class = Reflect.getMetadata('design:type', target, key);
    const propTypes: Map<string, Class> = Reflect.getMetadata(metadataKey, target);
    propTypes.set(key.toString(), interfaceOrClass);
};

export {
    reflected,
    metadataKey as reflectedMetadataKey,
};
