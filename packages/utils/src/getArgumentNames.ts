import { trim, last, first } from 'lodash';

const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

const enum FuncType {
    method = 'method',
    arrow = 'arrow',
    constructor = 'constructor',
    function = 'function',
}

const getFuncType = (fnStr: string): string => {
    const fnBodyStart = fnStr.indexOf('{');

    if (fnBodyStart === -1) {
        return FuncType.arrow;
    }

    const declarationSubStr = fnStr.substr(0, fnBodyStart);

    if (declarationSubStr.includes('=>')) {
        return FuncType.arrow;
    }

    if (declarationSubStr.includes('function')) {
        return FuncType.function;
    }

    if (fnStr.includes('class')) {
        return FuncType.constructor;
    }

    return FuncType.method;

};

const getArrowFunctionArgData = (fnStr: string): string[] => {
    const openBracket = fnStr.indexOf('(');
    const argSrtStart = (openBracket !== -1) ? (openBracket + 1) : 0;
    const argSrtEnd = (openBracket !== -1) ? fnStr.indexOf(')') : fnStr.indexOf('=');

    return fnStr.slice(argSrtStart, argSrtEnd).match(/([\s\S]*)/) ?? [];
};

const removePredefined = (argStrList: string[]) => {
    return argStrList.map(arg => trim(arg.split('=')[0]));
};

const getArgList = (argData: string[]): string[] => {
    return removePredefined(
        (argData && argData[1])
            ? argData[1]
                .split(',')
                .reduce(
                    (acc, curr) => {

                        if (
                            first(last(acc)) === '{'
                            && last(last(acc)) !== '}'
                        ) {
                            const lastArg = last(acc);
                            const newValue =  `${lastArg}, ${curr}`;
                            acc[acc.length - 1] = newValue;
                        } else {
                            acc.push(curr);
                        }

                        return acc;
                    },
                    [] as string[],
                )
                .map(arg => arg.replace(COMMENTS, '').trim()).filter(arg => arg)
            : [],
    );
};

export const getArgumentNames = function getArgNames(fn: Function): string[] {
    if (typeof fn !== 'function') {
        throw new TypeError('getFunctionArgNames argument is not a function');
    }

    const fnStr = fn.toString();
    const type = getFuncType(fnStr);

    if (type === FuncType.method) {
        return getArgList(fnStr.match(/s*?\(([^)]*)\)/) ?? []);
    }

    if (type === FuncType.arrow) {
        return getArgList(getArrowFunctionArgData(fnStr));
    }

    if (type === FuncType.function) {
        return getArgList(fnStr.match(/function\s.*?\(([^)]*)\)/) ?? []);
    }

    const argData = fnStr.match(/constructor*?\(([^)]*)\)/);

    if (!argData) {
        const superClass = Object.getPrototypeOf(fn.prototype).constructor;
        return !(superClass === Object) ? getArgNames(superClass) : [];
    }

    return getArgList(argData);
};
