import { isDefined } from './isDefined';

export const joinBy = (joinStr: string) => (...strList: (string | undefined)[]) => strList.filter(isDefined).join(joinStr);
export const joinBySpace = joinBy(' ');
export const joinByComma = joinBy(',');
export const joinAsLines = joinBy('\n');
