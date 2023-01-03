type ErrorFactory<K> = (key: K) => Error;

class ExistenceCheckingMap<K, V> extends Map<K, V> {

    private createNotFoundError: ErrorFactory<K>;
    private createAlreadyExistsError: ErrorFactory<K>;

    constructor(
        entries?: readonly (readonly [K, V])[] | null,
        createNotFoundError: ErrorFactory<K> = createDefaultNotFoundError,
        createAlreadyExistsError: ErrorFactory<K> = createDefaultAlreadyExistsError,
    ) {
        super(entries);
        this.createNotFoundError = createNotFoundError;
        this.createAlreadyExistsError = createAlreadyExistsError;
    }

    public getOrFail(key: K, createError: (key: K) => Error = this.createNotFoundError): V {
        this.checkExistence(key, createError);

        return this.get(key)!;
    }

    public add(key: K, value: V, createError: (key: K) => Error = this.createAlreadyExistsError): void {
        this.checkAbsence(key, createError);
        this.set(key, value);
    }

    public checkExistence(key: K, createError: (key: K) => Error = this.createNotFoundError): void {
        if (!this.has(key)) {
            throw createError(key);
        }
    }

    public checkAbsence(key: K, createError: (key: K) => Error = this.createAlreadyExistsError): void {
        if (this.has(key)) {
            throw createError(key);
        }
    }

    public checkExistenceForAll(keys: K[], createError: (keys: K[]) => Error = createErrorForKeys): void {
        const notExistedKeys = keys.filter(key => !this.has(key));

        if (notExistedKeys.length > 0) {
            throw createError(notExistedKeys);
        }
    }
}

const createDefaultNotFoundError: <K>(key: K) => Error = (key) => new Error(`value for key: ${key} not found`);
const createDefaultAlreadyExistsError: <K>(key: K) => Error = (key) => new Error(`value for key: ${key} already exists`);

const createErrorForKeys: <K>(keys: K[]) => Error = (keys) => {
    const keysStr = keys.map(it => typeof (it as {}).toString === 'function' ? (it as {}).toString() as string : it).join(',');
    return new Error(`values for keys: ${keysStr} not found`);
};

export {
    ExistenceCheckingMap,
    ErrorFactory,
};
