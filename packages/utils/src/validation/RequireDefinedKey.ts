import {
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { KeyOwner } from '@onion/types';

import { isDefined } from '../isDefined';

function RequireDefinedKey<T extends string>(...propertyNames: readonly T[]) {

    @ValidatorConstraint({ name: 'RequireDefinedKey', async: false })
    class RequireDefinedKey implements ValidatorConstraintInterface {

        validate(_: unknown, { object }: ValidationArguments) {
            return propertyNames.every(it => isDefined(object[it as keyof typeof object]));
        }

        defaultMessage({ property }: ValidationArguments) {
            return `"${property}" and "${propertyNames.join(', ')}" must be defined together.`;
        }

    }

    return Validate(RequireDefinedKey) as (target: KeyOwner<T>, propertyKey: string | symbol) => void;
}

export {
    RequireDefinedKey,
};
