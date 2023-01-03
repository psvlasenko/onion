import { isDate, isNumber, isUndefined } from 'lodash';
import { either } from 'ramda';

import { KeyOwner } from '@onion/types';
import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const isValid = (val: unknown): val is number | Date => either(isFinite, isDate)(val);

function IsGraterThan<T extends string>(propertyName: T) {

    @ValidatorConstraint({ name: 'IsGraterThan', async: false })
    class IsGraterThan implements ValidatorConstraintInterface {

        validate(value: number | Date, { object }: ValidationArguments) {
            const valueForComparing = object[propertyName as keyof typeof object];

            return isValid(value) && isValid(valueForComparing) && value > valueForComparing;
        }

        defaultMessage({ object, property }: ValidationArguments) {
            return isUndefined(object[propertyName as keyof typeof object])
                ? `${propertyName} is undefined, comparing with ${property} is impossible`
                : `"${property}" must be greater than "${propertyName}"`;
        }

    }

    return Validate(IsGraterThan) as (target: KeyOwner<T>, propertyKey: string | symbol) => void;
}

export {
    IsGraterThan,
};
