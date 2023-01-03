import { uniq } from 'lodash';

import { Collection } from '@onion/types';

import { idsOf } from './idsOf';
import { Identifiable } from './types';

export const uniqIdsOf = <T>(col: Collection<Identifiable<T>>): T[] => uniq(idsOf(col));
