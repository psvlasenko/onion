type FactoryOwner<T extends any[], U> = { newInstance: (...params: T) => U };

export const createNewInstanceOf = <T, U extends any[]>(cls: FactoryOwner<U, T>) =>
    (...params: U): T => cls.newInstance(...params);
