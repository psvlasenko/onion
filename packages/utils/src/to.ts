import { addHours, startOfDay } from 'date-fns';
import { isArray, isString } from 'lodash';
import { identity } from 'ramda';

import { ParseTo } from './types';
import { Validation } from './validation/Validation';

const isIso = (str: string | string[]) => !isArray(str) && Validation.isIso(str);

/** use with Transform decorator from 'class-transformer' */
const to = (
    parseTo: ParseTo,
    condition = parseTo === 'Date' ? isIso : (arg: string | string[]) => true,
) => (str: string | string[]) => {
    if (condition(str)) {
        return parse(str, parseTo);
    }

    return str;
};

type Result = string
    | number
    | boolean
    | string[]
    | (string|null)[]
    | number[]
    | Date
    | Date[]
    | null
    | undefined
    | (string|Date)[];

type Arg = string | string[] | undefined | null;

function parse(arg: Arg, parseTo: 'string[]', isOptional?: boolean): string[];
function parse(arg: Arg, parseTo: '(string|null)[]', isOptional?: boolean): (string|null)[];
function parse(arg: Arg, parseTo: 'null|string[]', isOptional?: boolean): null|string[];
function parse(arg: Arg, parseTo: 'number', isOptional?: boolean): number;
function parse(arg: Arg, parseTo: 'number[]', isOptional?: boolean): number[];
function parse(arg: Arg, parseTo: 'boolean', isOptional?: boolean): boolean;
function parse(arg: Arg, parseTo: 'Date', isOptional?: boolean): Date;
function parse(arg: Arg, parseTo: 'Date[]', isOptional?: boolean): Date[];
function parse(arg: Arg, parseTo: 'noon', isOptional?: boolean): Date;
function parse(
    arg: Arg,
    parseTo: ParseTo,
    isOptional?: boolean,
): Result;
function parse(
    arg: Arg,
    parseTo: ParseTo,
    isOptional = false,
): Result {
    if (!arg) {
        return isOptional ? undefined : arg;
    }

    const parsers: Record<ParseTo, (arg: string | string[]) => Result> = {
        ['number']: arg => Number(arg),
        ['number[]']: arg => isArray(arg) ? arg.map(item => Number(item)) : arg.split(',').map(item => Number(item)),
        ['string[]']: arg => toArray(arg),
        ['(string|null)[]']: arg => toArray(arg).map(it => it === 'null' ? null : it),
        ['null|string[]']: arg => arg === 'null' || arg === null ? null : toArray(arg),
        ['boolean']: arg => arg === 'true' ? true : arg === 'false' ? false : arg,
        ['Date']: arg => isString(arg) ? toDateIfIso(arg) : arg,
        ['Date[]']: arg => toArray(arg).map(toDateIfIso),
        ['noon']: arg => Validation.isDateString(arg.toString()) ? moscowNoonFrom(arg) : arg,
    };

    const parser = parsers[parseTo] ?? identity;

    return parser(arg);
}

const toDateIfIso = (str: string): string | Date => Validation.isIso(str.toString()) ? new Date(str.toString()) : str;
const toArray = <T>(str: string | T[]) => isArray(str) ? str : str.split(',');
const moscowNoonFrom = (str: string | string[]) => addHours(startOfDay(addHours(new Date(str.toString()), 4)), 15);

export {
    to,
    parse,
};
