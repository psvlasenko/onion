import { isUndefined, negate } from 'lodash';

type IsDefined = <T>(arg?: T | undefined) => arg is T;

const isDefined = negate(isUndefined) as IsDefined;

export {
    isDefined,
};
