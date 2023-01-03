import { ValidationOptions, ValidationTypes } from 'class-validator';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import { ValidationMetadataArgs } from 'class-validator/metadata/ValidationMetadataArgs';
import { MetadataStorage } from 'class-validator/metadata/MetadataStorage';
import { getFromContainer } from 'class-validator/container';

/**
 * Checks if value is missing and if so, ignores all validators.
 */
function NotRequired(validationOptions?: ValidationOptions): PropertyDecorator {
    return ((object: object, propertyName: string): void => {
        type Key = keyof typeof object;

        const args: ValidationMetadataArgs = {
            propertyName,
            validationOptions,
            type: ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            constraints: [(object: object, value: any): boolean => object[propertyName as Key] !== undefined],
        };

        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    }) as PropertyDecorator;
}

export {
    NotRequired,
};
