import { curry } from 'lodash';

type Repository<T> = { get: (id: T) => unknown };
type Id<T> = T extends Repository<infer U> ? U : never;

type CurriedFunc = {
    <R extends Repository<Id<R>>>(repository: R): (id: Id<R>) => ReturnType<R['get']>;
    <R extends Repository<Id<R>>>(repository: R, id: Id<R>): ReturnType<R['get']>;
};

const getFromRepository = async<U>(repository: Repository<U>, id: U) => {
    return repository.get(id);
};

const getFrom: CurriedFunc = curry(getFromRepository);

export { getFrom };
