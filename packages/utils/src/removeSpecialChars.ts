import { isNil } from 'lodash';

export function removeSpecialChars(str?: string): string | undefined;
export function removeSpecialChars(str?: null): null | undefined;
export function removeSpecialChars(str?: string | null): string | null | undefined {
    return !isNil(str)
        ? str.replace(/[^a-zA-Zа-яА-я0-9№]/g, ' ')
            .replace(/\s\s+/g, ' ')
            .trim()
        : str;
}
