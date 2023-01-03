import { curry } from 'ramda';

type Repository<O extends unknown, E extends unknown> = { find: (options?: O) => Promise<E[]> };
type Options<T extends unknown> = T extends Repository<infer U, any> ? U : never;
type Entity<T> = T extends Repository<any, infer U> ? U : never;

type Curried = {
    <O extends unknown, E extends unknown>(repository: Repository<O, E>, options: O):  Promise<E[]>;
    <O extends unknown, E extends unknown>(repository: Repository<O, E>): (options: O) =>  Promise<E[]>;
};

const fn = <O extends unknown, E extends unknown>(repository: Repository<O, E>, options: O): Promise<E[]> => repository.find(options);

const findIn: Curried = curry(fn);

export {
    Options,
    Entity,
    Repository as RepositoryForSearch,
    findIn,
};
