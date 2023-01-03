import { curry } from 'ramda';

import { Repository } from './types';

type SavingRepository<Entity> = Pick<Repository<Entity, any, any>, 'save'>;

type Entity<T> = T extends SavingRepository<infer U> ? U : never;

type CurriedFunc = {
    <E extends object>(repository: SavingRepository<E>): (entity: E) => ReturnType<typeof repository['save']>;
    <E extends object>(repository: SavingRepository<E>): (entity: E[]) => ReturnType<typeof repository['save']>;
    <E extends object>(repository: SavingRepository<E>, entity: E): ReturnType<typeof repository['save']>;
    <E extends object>(repository: SavingRepository<E>, entity: E[]): ReturnType<typeof repository['save']>;
};

const saveToRepository = async <T extends object>(repository: SavingRepository<T>, entity: Entity<Repository<T>>) => repository.save(entity);

const saveTo: CurriedFunc = curry(saveToRepository);

export {
    saveTo,
    SavingRepository as RepositoryForSaving,
    Entity as RepositoryForSavingEntity,
};
