const failIf = <T>(createError: (params: T) => Error) =>
    (predicate: boolean, params: T): void => {
        if (predicate) {
            throw createError(params);
        }
    };
