export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Orderable = Date | number;
export type Class<T = any, U extends unknown[] = any[]> = { new (...arg: U): T } & Function;
export type AbstractClass<T = any, U extends unknown[] = unknown[]> = abstract new (...arg: U) => T & Function;
export type Identifiable<T = unknown> = { id: T };
export type Collection<T> =  { values(): IterableIterator<T> };
export type Instance<T extends Function> = T extends abstract new (...arg: any) => infer U ? U : T['prototype'];
export type PromiseValue<T> = T extends Promise<infer U> ? U : T;
export type KeyOwner<T extends ObjectKey> = T extends keyof infer U ? Partial<U> : unknown;
export type OwnerOf<T extends string> = { [key in T]?: unknown };
export type ObjectKey = string | number | symbol;
export type Predicate<T> = (arg: T) => boolean;
export type ElementOf<T> = T extends ReadonlyArray<infer U> ? U : unknown;
export type ItemOf<T> = T extends (ReadonlyArray<infer U> | Array<infer U>) ? U : T;
export type SearchOptionsValue<T> = Nullable<T> | Nullable<T>[];
export type DateKeysOf<T> = ({[P in keyof T]: T[P] extends Date ? P : never })[keyof T];
export type ObjectKeysOf<T> = ({ [P in keyof T]: T[P] extends object ? P : never })[keyof T];
export type StringKeysOf<T> = Exclude<({[P in keyof T]: string extends Record<P, T[P]>[P] ? P : never })[keyof T], undefined>;
export type OKeysOf<T> = Exclude<({[P in keyof T]: T[P] extends {} ? P : never })[keyof T], undefined>;
export type OptionalKeysOf<T> = Exclude<({[P in keyof T]: undefined extends T[P] ? P : never })[keyof T], undefined>;
export type RequiredKeysOf<T> = Exclude<keyof T, OptionalKeysOf<T>>;
export type NumericKeysOf<T> = ({[P in keyof T]: number extends T[P] ? P : never })[keyof T];
export type NotRequiredKeysOf<T> = Exclude<{ [K in keyof T]: T extends Record<K, T[K]> ? never : K}[keyof T], undefined>;
export type WithRequired<T extends object, K extends keyof T> = T & Required<Pick<T, K>>;
export type WithNullable<T extends object, K extends keyof T> = Omit<T, K> & {[P in K]: T[P] | null };
export type WithDefined<T extends object, K extends keyof T> = T & Required<({[P in K]: undefined extends T[P] ? Exclude<T[P], undefined> : T[P] })>;
export type OptionalAsNotRequired<T> = { [key in RequiredKeysOf<T>]: T[key] } & { [key in keyof T]?: T[key] }
export type OptionalAsUndefined<T, K extends keyof T> = T & { [key in K]: undefined }
export type OrderableKeys<T> = ({[P in keyof T]: T[P] extends Orderable ? P : never })[keyof T];
export type Body<T extends Class> = ConstructorParameters<T> extends [{ body: infer U}] ? U : never;
export type PramsOf<T> = T extends (Class<unknown, infer U> | AbstractClass<unknown, infer U>)
    ? U
    : T extends (...args: infer U) => unknown ? U : never;

export type ObjectKey = string | number | symbol;

export const enum EventTechnicalStatus {
    active = 'active',
    deleted = 'deleted',
    special = 'special'
}

export type VersionedIdentity = {
    id: string;
    version: number;
}

export type DatesAsString<T extends object> = {
    [key in keyof T]: T[key] extends (Date) ? string
    : T[key] extends (Date | undefined) ? string | undefined
    : T[key] extends (Date | undefined | null) ? string | undefined | null
    : T[key] extends (Optional<Date>) ? Optional<string>
    : T[key] extends (Nullable<Date>) ? Nullable<string>
    : T[key]
};

export type MethodNamesOf<T> = Exclude<({[P in keyof T]: T[P] extends Function ? P : never })[keyof T], undefined>;
type ObjKeys<T> = ({[P in keyof T]: T[P] extends object ? P : never })[keyof T];
type ArrKeys<T> = ({[P in keyof T]: T[P] extends (infer U)[] ? P : never })[keyof T];
type NestedObjKeys<T, U extends Object> = ({[P in keyof T]: T[P] extends U ? P : never })[keyof T];
type SimpleDocumentKeys<T> = ({
    [P in keyof T]: T[P] extends Optional<(number|number[]|string|string[]|boolean|boolean[]|Date|Date[])|null> ? P : never
})[keyof T];

export type MethodsOf<T extends object> = Pick<T, MethodNamesOf<T>>;
export type ObjectKeys<T extends object> = Pick<T, ObjKeys<T>>;
export type ArrayKeys<T extends object> = Pick<T, ArrKeys<T>>;
export type SimpleKeys<T extends object> = Pick<T, SimpleDocumentKeys<T>>;
export type Attributes<T extends object> = Omit<T, MethodNamesOf<T>>;
export type NestedObjectKeys<T, U extends Object> = Omit<T, NestedObjKeys<T, U>>;
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

export type RequireAtLeastOne<T, P extends keyof T = keyof T> = Pick<T, Exclude<keyof T, P>>
    & { [K in P]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<P, K>>> }[P];

export type RequireOnlyOne<T, P extends keyof T = keyof T> = Pick<T, Exclude<keyof T, P>>
    & { [K in P]-?: Required<Pick<T, K>> & Partial<Record<Exclude<P, K>, undefined>> }[P];

export type StringArrayAsString<T extends Object> = { [key in keyof T]: T[key] extends string[] | undefined | null ? string : T[key] };
export type NumberArrayAsNumber<T extends Object> = { [key in keyof T]: T[key] extends number[] | undefined | null ? string : T[key] };

interface Entity {
    getIdentity(): string | { id: string };
}

export type Sorter<T extends string, U = 'ASC' | 'DESC'> = {
    [key in T]: (order: U) => void
};

export type Identity<T extends object> = T extends Entity ? ReturnType<T['getIdentity']>
    : T extends Identifiable ? T['id'] | ({ id: T['id'] } & Partial<Attributes<T>>)
    : Partial<Attributes<T>>;

export type DefaultIdentity<T> = T extends Entity ? ReturnType<T['getIdentity']> : T extends Identifiable ? T['id'] : Partial<T>;

export const enum JsType {
    Undefined =	"undefined",
    Object = "object",
    Boolean = "boolean",
    Number = "number",
    String = "string",
    Symbol = "symbol",
    Function = "function",
    BigInt = "bigint",
}

export interface BaseFindOption<T extends number | string> {
    id?: T | T[];
    ids?: T[];
}

export interface Interval {
    start: Date;
    end: Date;
}

export type ScheduleModelId = string;
export type StartOfDayTimestamp = number;

export type Names = {
    lastName?: string;
    firstName?: string;
    patronymic?: string;
};

export type EventScope = {
    authorId: string;
    occurredOn: Date;
};

// TODO
export interface Factory<T = unknown, P = unknown> {
    create(...args: P[]): T;
}

export interface DiFactory {
    create<T, U extends unknown[]>(ctor: Class<T, U>, ...params: U): T;
}

export interface Logger {
    debug(message: any, ...args: any[]): void;
    info(message: any, ...args: any[]): void;
    warn(message: any, ...args: any[]): void;
    error(message: any, ...args: any[]): void;
    fatal(message: any, ...args: any[]): void;
}
