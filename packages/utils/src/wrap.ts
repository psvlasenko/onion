import { curry } from 'ramda';

type Curried = {
    <K extends string, T>(key: K, value: T): { [k in K]: T };
    <K extends string, T>(key: K): (value: T) => { [k in K]: T };
};

export const wrap: Curried = curry(
    <K extends string, T>(key: K, value: T): { [k in K]: T } => ({ [key]: value }) as { [k in K]: T },
);
