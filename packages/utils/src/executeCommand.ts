import { curry } from 'ramda';

type UnaryCommandClass<T, R>  = new (params: T) => { execute(): R };

type FirstArg<T> = T extends UnaryCommandClass<infer U, any> ? U : never;
type Result<T> = T extends UnaryCommandClass<any, infer U> ? U : never;

type Executor = {
    <T extends UnaryCommandClass<any, any>>(commandClass: T, params: FirstArg<T>): Result<T>;
    <T extends UnaryCommandClass<any, any>>(commandClass: T): (params: FirstArg<T>) => Result<T>;
};

const executeCommand: Executor = curry(
    (commandClass, params) => {
        const command = new commandClass(params);

        return command.execute();
    }
);

export {
    executeCommand
};
