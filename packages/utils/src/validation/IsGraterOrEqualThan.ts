import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isString, isUndefined } from 'lodash';

import { KeyOwner } from '@onion/types';

function IsGraterOrEqualThan<T extends string>(propertyName: T) {

    @ValidatorConstraint({ name: 'IsGraterOrEqualThan', async: false })
    class IsGraterOrEqualThan implements ValidatorConstraintInterface {

        validate(value: number, { object }: ValidationArguments) {
            const propVal = object[propertyName as keyof typeof object];

            if (!isString(propVal)) {
                return false;
            }

            const valueForComparing = parseFloat(propVal);
            return isFinite(value) && isFinite(valueForComparing) && value >= valueForComparing;
        }

        defaultMessage({ object, property }: ValidationArguments) {
            return isUndefined(object[propertyName as keyof typeof object])
                ? `${propertyName} is undefined, comparing with ${property} is impossible`
                : `${property} isn't greater than ${propertyName}`;
        }

    }

    return Validate(IsGraterOrEqualThan) as (target: KeyOwner<T>, propertyKey: string | symbol) => void;
}

export {
    IsGraterOrEqualThan,
};
