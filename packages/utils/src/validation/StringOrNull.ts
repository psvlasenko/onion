import { isArray, isNull, isString } from 'lodash';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

interface Options {
    each?: boolean;
}

function StringOrNull({ each }: Options = {}) {

    @ValidatorConstraint({ name: 'StringOrNull', async: false })
    class StringOrNull implements ValidatorConstraintInterface {

        validate(nullableStringList: string | null | (string | null)[], args: ValidationArguments) {
            return !each
                ? isString(it) || isNull(it)
                : isArray(nullableStringList) && nullableStringList.every(it => isString(it) || isNull(it));
        }

        defaultMessage(args: ValidationArguments) {
            return each ? '($value) is not an array of strings or nulls' : '($value) is not a string or null';
        }

    }

    return Validate(StringOrNull);
}

export {
    StringOrNull,
};
