import { first, isFunction, isNil, toPairs } from 'lodash';
import 'reflect-metadata';

import { isDefined, isNotEmpty } from '@onion/utils';

import { InstanceInjectionStrategy } from './InstanceInjectionStrategy';

function getSetterDescriptors(obj: unknown, descriptors: Map<string, PropertyDescriptor> = new Map()): Map<string, PropertyDescriptor> {
    if (obj === Object.prototype || isNil(obj)) {
        return descriptors;
    }

    toPairs(Object.getOwnPropertyDescriptors(obj))
        .filter(([_, descriptor]) => isFunction(descriptor.set))
        .forEach(([key, descriptor]) => descriptors.set(key, descriptor));

    const proto = Object.getPrototypeOf(obj);

    if (proto === Object.prototype || isNil(proto)) {
        return descriptors;
    }

    return getSetterDescriptors(proto, descriptors);
}

export class SetterInjectionStrategy extends InstanceInjectionStrategy {

    public inject(instance: { [key: string]: unknown }) {
        this.injectAttributesBySetters(instance);
    }

    private injectAttributesBySetters(instance: { [key: string]: unknown }) {
        const descriptorsForSetterInjection = getSetterDescriptors(instance);

        if (descriptorsForSetterInjection.size > 0) {
            descriptorsForSetterInjection.forEach((_, key) => {
                const types = Reflect.getMetadata('design:paramtypes', instance, key);

                if (isNotEmpty(types)) {
                    const injectedService = this.diContainer.get(first(types));

                    if (isDefined(injectedService)) {
                        instance[key] = this.diContainer.get(first(types));
                        return;
                    }
                }

                if (isDefined(this.diContainer[key])) {
                    instance[key] = this.diContainer[key];
                }
            });
        }
    }

}
