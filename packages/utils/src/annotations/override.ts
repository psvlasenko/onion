import assert from 'assert';

export const override: MethodDecorator = (
    proto: Object,
    methodName: string | symbol,
): void => assert.ok(methodName in Object.getPrototypeOf(proto), 'is not a supertype method');
