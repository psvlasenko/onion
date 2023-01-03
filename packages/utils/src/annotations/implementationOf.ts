import 'reflect-metadata';

const metadataKey = Symbol('interface implementations marked by "implementationOf"');

type AC<T> = (abstract new (...arg: any[]) => T) & Function;

function implementationOf<T>(interfaceAsAbstractClass: AC<T>): (target: AC<T>) => void;
function implementationOf<T, U>(
    abstractClass1: AC<T>,
    abstractClass2: AC<U>,
): (target: AC<T> & AC<U>) => void;
function implementationOf<T, U, V>(
    abstractClass1: AC<T>,
    abstractClass2: AC<U>,
    abstractClass3: AC<V>
): (target: AC<T> & AC<U> & AC<V>) => void;
function implementationOf<T extends Function>(...interfaceAsAbstractClass: any[]): (target: T) => void {
    return (target: T) => Reflect.defineMetadata(metadataKey, interfaceAsAbstractClass, target);
}

export {
    implementationOf,
    metadataKey as implementationOfMetadataKey,
};
