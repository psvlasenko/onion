import 'reflect-metadata';

import { markersMetadataKey } from '@onion/utils';

import type { MarkerExtractor } from '../types';
import { isClass } from '../utils/isClass';

export const annotationMarkerExtractor: MarkerExtractor = instanceOrClass => {
    const proto = isClass(instanceOrClass)
        ? instanceOrClass.prototype
        : Object.getPrototypeOf(instanceOrClass);

    return Reflect.getMetadata(markersMetadataKey, proto) ?? new Set();
};
