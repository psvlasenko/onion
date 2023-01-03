import { Collection } from '@onion/types';

import { idsOf } from './idsOf';
import { Identifiable } from './types';

export const idsString = <T>(col: Collection<Identifiable<T>>): string =>
    idsOf([...col.values()]).join(', ');
