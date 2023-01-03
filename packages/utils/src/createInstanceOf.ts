import { Class } from '@onion/types';

export const createInstanceOf = <T extends Class>(cls: T) =>
    (...params: ConstructorParameters<T>): InstanceType<T> => new cls(...params);
