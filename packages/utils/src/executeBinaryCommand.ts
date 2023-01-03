import { curry } from 'ramda';
import type { F } from 'ts-toolbelt';

type BiCommandClass<T, U, R>  = new (arg1: T, arg2: U) => { execute(): R };

type FirstArgOf<T> = T extends BiCommandClass<infer U, any, any> ? U : never;
type SecondArgOf<T> = T extends BiCommandClass<any, infer U, any> ? U : never;
type Result<T> = T extends BiCommandClass<any, any, infer U> ? U : never;

type Executor = {
    <T extends BiCommandClass<any, any, any>>(commandClass: T, ...args: [FirstArgOf<T>, SecondArgOf<T>]): Result<T>;
    <T extends BiCommandClass<any, any, any>>(commandClass: T): F.Curry<(...args: [FirstArgOf<T>, SecondArgOf<T>]) => Result<T>>;
};

const executeBinaryCommand: Executor = curry(
    (commandClass, a0, a1) => {
        const command = new commandClass(a0, a1);

        return command.execute();
    }
);

export {
    FirstArgOf,
    SecondArgOf,
    executeBinaryCommand
};
