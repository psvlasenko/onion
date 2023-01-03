import { isEmpty, negate } from 'lodash';

export const compactTemplate = (template: string) =>
    template
        .split('\n')
        .map(it => it.replace(/\t/g, '').replace(/\s{4}/g, ''))
        .filter(negate(isEmpty))
        .reduce((str, it) => str.endsWith('}}') || it.startsWith('{{') || str === '' ? `${str}${it}` : `${str} ${it}`, '');
