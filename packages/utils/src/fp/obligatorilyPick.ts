import { pickAll } from 'ramda';

import { KeyOwner, NotRequiredKeysOf, RequiredKeysOf } from '@onion/types';

type Result<K extends string, T extends KeyOwner<K>> = { [key in (RequiredKeysOf<T> & K)]: T[key] }
& { [key in (NotRequiredKeysOf<T> & K)]: T[key] | undefined };

type Picker = {
    <K extends string>(...keys: K[]): <T extends KeyOwner<K>>(obj: T) => Result<K, T>;
};

export const obligatorilyPick: Picker = (...keys) => obj =>  pickAll(keys, obj);
