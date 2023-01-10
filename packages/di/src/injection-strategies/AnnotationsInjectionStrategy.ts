import { isUndefined } from 'lodash';
import 'reflect-metadata';

import { Class } from '@onion/types';
import { isDefined, reflectedMetadataKey } from '@onion/utils';

import { InstanceInjectionStrategy } from './InstanceInjectionStrategy';

export class AnnotationsInjectionStrategy extends InstanceInjectionStrategy {

    public inject(instance: { [key: string]: unknown }): void {
        const propertyTypes: Map<string, Class> = Reflect.getMetadata(reflectedMetadataKey, instance);

        if (isDefined(propertyTypes)) {
            Array.from(propertyTypes).forEach(([key, type]) => {
                if (isUndefined(instance[key])) {
                    instance[key] = this.diContainer.get(type);
                }
            });
        }

    }

}
