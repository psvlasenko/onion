import isValid from 'date-fns/isValid';

import isEmail from 'validator/lib/isEmail';
import PhoneNumber from 'awesome-phonenumber';
import isUrl from 'validator/lib/isURL';

import { isDefined } from '../isDefined';

export enum TechnicalStatus {
    active = 'active',
    deleted = 'deleted',
    archive = 'archive',
}

export class Validation {

    public static readonly birthDateRegExp = /([12]\d{3}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01]))/;
    public static readonly phoneRegExp = /^\d+$/;
    public static readonly emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    public static readonly snilsRegExp = /^(\d{11})?$/;
    public static readonly innRegExp = /^(\d{10,12})?$/;
    public static readonly nameRegExp = /^[а-я,А-Я,A-Z,a-z]{2,30}/;
    public static readonly wordRegExp = /^[а-я,А-Я,A-Z,a-z]+$/;
    public static readonly formattedDateRegExp = /\d\d.\d\d.\d\d\d\d/;
    public static readonly dateString = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|30|31)$/; // 2021-12-30
    public static readonly isoRegExp = /^([\+-]?\d{4}(?!\d{2}\b))(-)((0[1-9]|1[0-2])((-?)([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?$/;

    public static get patientSex(): ['m', 'f'] {
        return ['m', 'f'];
    }

    public static isNumberString(value: string): boolean {
        return /^\d+$/.test(value);
    }

    public static notEmpty(value?: string): boolean {
        return isDefined(value) && value.length > 0;
    }

    public static isName(value: string): boolean {
        return Validation.nameRegExp.test(value);
    }

    public static isWord(value: string): boolean {
        return value === '' || Validation.wordRegExp.test(value);
    }

    public static isDate(value: string): boolean {
        return isValid(new Date(value));
    }

    public static isFormattedDate(value: string): boolean {
        return Validation.formattedDateRegExp.test(value);
    }

    public static isPhone(value: string): boolean {
        return Validation.phoneRegExp.test(value);
    }

    public static isPhoneString(value: string): boolean {
        const phone = new PhoneNumber(value);
        return phone.isValid();
    }

    public static isEmail(value: string): boolean {
        return isEmail(value);
    }

    public static isSnils(value: string): boolean {
        return Validation.snilsRegExp.test(value);
    }

    public static isInn(value: string): boolean {
        return Validation.innRegExp.test(value);
    }

    public static isUrl(value: string): boolean {
        return isUrl(value);
    }

    public static isIso(value: string) {
        return Validation.isoRegExp.test(value);
    }

    public static isDateString(value: string) {
        return Validation.dateString.test(value);
    }

}
