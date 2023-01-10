import 'reflect-metadata';

import { implementationOfMetadataKey } from '@onion/utils';
import type { TypeExtractor } from '../types';

export const annotationTypeExtractor: TypeExtractor = obj => Reflect.getMetadata(implementationOfMetadataKey, obj);
