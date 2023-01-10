import type { AbstractClass, Class } from '@onion/types';
import type { DiContainer } from './DiContainer';

export type MarkerInterface = AbstractClass;
export type TypeExtractor = (instanceOrClass: object) => Class[];
export type MarkerExtractor = (instanceOrClass: object | Class) => Set<MarkerInterface>;
export type TypeToken = MarkerInterface | Symbol | Function;

export type StringKey<T> =  keyof T & string;

export type Dependency = Function | object;

export type LoadedContext<T> = DiContainer & { [key: string]: any };

export const enum RequiredComponents {
    launcher = 'launcher',
    commands = 'commands',
}

export type FactoryFunc<T> = (...args: any[]) => T;

export interface CreationOption {
    alias?: string;
    args?: string[];
    cache?: boolean;
    implementationOf?: Class | AbstractClass;
}

export interface FactoryCreationOption extends CreationOption {
    alias: string;
}

export type Keys<T> = (keyof T)[];

export interface DiConfigValues { [key: string]: any; }

export interface DiConfig {
    classPath: string[];
    values?: DiConfigValues;
}
