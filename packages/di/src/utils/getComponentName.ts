import lodash, { camelCase } from 'lodash';

import { AbstractClass } from '@onion/types';
import { isSymbol, not } from '@onion/utils';

import { TypeToken } from '../types';
import { isClass } from './isClass';

const isInterface = (cls: AbstractClass): boolean => {
    const name = cls.name;

    return name[0] === 'I' && (/[A-Z]/).test(name[1]) && isEmptyClass(cls);
}

function isEmptyClass(cls: AbstractClass): boolean {
    const strArr = cls.toString().split('{');

    if (strArr.length !== 2) {
        return false;
    }

    return lodash(strArr.at(-1)!.split(' '))
        .map(it => it.trim())
        .compact()
        .filter(it => not(
            it === '}'
            || it === ';'
            || it === '};'
        ))
        .isEmpty();
}

const specialPrefixes = ['Mock', 'Stub'];
const removeSpecialPrefixes = (str: string) => specialPrefixes.reduce((str, prefix) => str.replace(prefix, ''), str);

const getClassName = (cls: AbstractClass) =>
    isInterface(cls) ? cls.name.slice(1) : removeSpecialPrefixes(cls.name);

const getInstanceName = (obj: object) =>
    removeSpecialPrefixes(obj.constructor.name);

const nameOf = (tkn: TypeToken): string => {
    const name = (
        isClass(tkn) ? getClassName(tkn) :
        isSymbol(tkn) ? tkn.description :
        getInstanceName(tkn)
    );

    return camelCase(name);
};

export {
    nameOf,
};
