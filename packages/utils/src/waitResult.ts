import { isUndefined } from 'lodash';

import { Optional } from '@onion/types';

import { wait } from './wait';

export class WaitResultFailError extends Error {
    public cause: Error | undefined;

    constructor(message: string, cause?: Error) {
        super(message);
        this.cause = cause;
    }
}

export interface Params<T> {
    step?: number;
    timeOut?: number;
    maxCount?: number;
    errorMessage?: string;
    previousResult?: T | Error | undefined;
}

/**
 * @param callback mustn't return undefined
 * @throws WaitResultFailError
 */
export const waitResult = async <T>(
    callback: () => T,
    {
        errorMessage = `waitResult is fail require.main.filename: ${require.main?.filename}`,
        maxCount = 10,
        timeOut = Math.ceil(Math.random() * 5 + 15),
        step = Math.ceil(Math.random() * 5 + 3),
        previousResult = undefined,
    }: Params<T> = {},
): Promise<T> => {
    let result: Optional<T | Error> = previousResult;

    if (maxCount === 0) {
        if (result instanceof Error) {
            console.error(result);
            throw new WaitResultFailError(`${errorMessage} by cause: ${result.toString()}, look at WaitResultFailError.cause for more info`, result);
        }

        throw new WaitResultFailError(errorMessage);
    }

    try {
        result = await callback();
    } catch (err) {
        result = err instanceof Error ? err : new Error(err?.toString() ?? 'unknown error');
    }

    if (isUndefined(result) || result instanceof Error) {
        await wait(timeOut);

        return waitResult(callback, { errorMessage, maxCount: maxCount - 1, timeOut: timeOut + step, previousResult: result });
    }

    return result;
};
