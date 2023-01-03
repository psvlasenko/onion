export type Callback<T> = {
    (): T;
};

export type Identifiable<T> = { id: T };

export type ParseTo = 'number' | 'number[]' | 'string[]' | '(string|null)[]' | 'null|string[]'| 'boolean' | 'Date' | 'Date[]' | 'noon';
