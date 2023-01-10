import assert from 'assert';
import { compact, isEmpty, isFunction, isNil, isString, isUndefined } from 'lodash';

import { AbstractClass, Class, DiFactory, Factory, PramsOf, WithRequired } from '@onion/types';
import {
    createTypeSymbol,
    entriesFrom,
    getArgumentNames,
    importClassesByPath,
    isDefined,
    isNotEmpty,
    isSymbol,
    keysFrom,
    Optional
} from '@onion/utils';

import { AnnotationsInjectionStrategy, InstanceInjectionStrategy, SetterInjectionStrategy } from './injection-strategies';
import { annotationMarkerExtractor } from './marker-extractors/annotationMarkerExtractor';
import { annotationTypeExtractor, constructorTypeExtractor } from './type-extractors';
import {
    CreationOption, DiConfig, DiConfigValues, LoadedContext,
    MarkerExtractor,
    MarkerInterface, StringKey,
    TypeExtractor, TypeToken
} from './types';
import { nameOf } from './utils/getComponentName';

interface Params {
    injectionStrategyClasses?: Class<InstanceInjectionStrategy>[];
    typeExtractors?: TypeExtractor[];
    markerExtractors?: MarkerExtractor[];
}

type Getter = () => any;
type Token = string;
type GetResult<T extends TypeToken> = T extends AbstractClass ? Optional<InstanceType<T>> : unknown;

interface ClassGetterCreationParams {
    cls:  Class,
    alias: string,
    args?: string[],
    cache: boolean,
}

interface FactoryGetterCreationParams {
    factory:  Factory | Function | string,
    alias: string,
    args: string[],
    cache: boolean,
}

interface BackupData {
    cache: Map<string, any>;
    classTokens: Map<TypeToken, Token>;
    tokenSet: Set<Token>;
    getFuncs: Map<Token, Getter>;
}

interface Backup {
    update(): void;
    restore(): void;
}

const DiFactory = createTypeSymbol({ description: 'DiFactory', path: __filename });

/**
 * DI container class
 * by default support constructor, setter and annotation injection. Can be used as service locator.
 * See examples in Context.test.ts
 * [params.injectionStrategyClasses] - array of InstanceInjectionStrategy instances,
 *                                     which defines supported algorithms of service injection
 *                                     to instance witch will be got from context.
 * [params.typeExtractors] - array of function which extract type information from object
 */
class DiContainer {

    #dFactory: DiFactory;

    [key: string]: unknown;

    private tokenSet: Set<string> = new Set();
    private marked = new Map<TypeToken, Set<TypeToken>>();
    private cache: Map<string, any> = new Map();
    private injectionStrategies: InstanceInjectionStrategy[];
    private typeExtractors: TypeExtractor[];
    private markerExtractors: MarkerExtractor[];
    private classGetterNames = new Map<TypeToken, string>();
    private backup: Backup;

    constructor({
        injectionStrategyClasses = [SetterInjectionStrategy, AnnotationsInjectionStrategy],
        typeExtractors = [annotationTypeExtractor, constructorTypeExtractor],
        markerExtractors = [annotationMarkerExtractor],
    }: Params = {}) {
        this.injectionStrategies = injectionStrategyClasses.map(StrategyClass => new StrategyClass(this));
        this.typeExtractors = typeExtractors;
        this.markerExtractors = markerExtractors;
        this.backup = this.createBackup();
        this.#dFactory = createDiFactory(this);
        this.classGetterNames.set(DiFactory, 'dFactory');
    }

    /**
     * return instance self link
     */
    public get context() {
        return this;
    }

    public get dFactory(): DiFactory {
        return this.#dFactory;
    }

    /**
     * return array of string tokens for all contained services
     */
    public get tokens(): string[] {
        return [...this.tokenSet];
    }

    /**
     * load classes, values e.t.c according to DiConfig
     */
    public init(config: DiConfig) {
        assert.ok(isDefined(config), 'Context initialization error: DiConfig is undefined');

        this.loadClassesByPath(...config.classPath);

        const loadValues = (configValues: DiConfigValues) => Object.entries(configValues)
            .forEach(([key, value]) => this.addValue(key, value));

        Optional.map(loadValues, config.values);
    }

    /**
     * add service to context by class
     * @param aClass - service class
     * @param [alias = aClass name in camelCase notation] - service token.
     * @param [cache = true] - if true service instance will be cached and always will be returned single instance,
     *                else new instance will be created for each service getter call.
     */
    public add<T, P>(
        aClass: Class<T>,
        alias: StringKey<P> = this.getterNameFor(aClass) as StringKey<P>,
        cache = true,
    ): this & { [key in keyof P]: T } {
        this.addClass(aClass, { alias, cache });

        return this as this & { [key in keyof P]: T };
    }

    /**
     * add service to context by class, use this method if class constructor args must be strictly defined
     * @param cls - service class
     * @param [options]
     * @param [options.alias = aClass name in camelCase notation] - service token
     * @param [options.args] - list of context tokens which satisfy to class constructor arguments
     * @param [options.cache = true] - if true service instance will be cached and always will be returned single instance,
     *                                 else new instance will be created for each service getter call.
     */
    public addClass<T, P>(
        cls: Class<T>,
        { alias = this.getterNameFor(cls) as StringKey<P>, args, cache = true, implementationOf }: CreationOption = {},
    ):  this {
        const classTypes = this.extractTypes(cls);

        if (isDefined(implementationOf) && !classTypes.includes(implementationOf)) {
            classTypes.push(implementationOf);
        }

        classTypes.forEach(type => this.setToken(type, alias, cls.name));
        const markers = this.extractMarkers(cls);
        this.addMarkers(cls, markers);
        const getter = this.createClassGetter({ cls, alias, args, cache });
        this.define(getter, alias);

        return this;
    }

    /**
     * add value to context without any changes
     * @param value - any
     * @param alias - token string.
     */
    public addValue<T>(
        value: T,
        alias: string,
        implementationOf?: TypeToken,
    ): this {
        const getter = this.createValueGetter(value, alias);
        this.define(getter, alias);

        this.setToken(
            implementationOf,
            alias,
            value instanceof Object ? value.constructor.name : 'unknown component'
        );

        return this;
    }

    /**
     * add service factory
     * @param factory - service factory
     * @param [options]
     * @param [options.alias = instance constructor name in camelCase notation] - service token
     * @param [options.args] - factory arguments
     * @param [options.cache = true] - if true service instance will be cached and always will be returned single instance,
     *                                 else new instance will be created for each service getter call.
     */
    public addFactory<P extends object>(
        factory: Factory | Function | string,
        { alias, implementationOf, args = [], cache = true }: WithRequired<CreationOption, 'alias'>,
    ): this & P {
        const getter = this.createFactoryGetter({ factory, alias, args, cache });
        this.define(getter, alias);
        const sourceName = `${implementationOf?.name ?? alias ?? 'unknown component'} factory`;
        Optional.map(cls => this.setToken(cls, alias, sourceName), implementationOf);

        return this as this & P;
    }

    /**
     * add token for service
     * @param serviceToken - current service token
     * @param alias - additional service token
     */
    public setAlias<P extends Object, T extends AbstractClass = any>(
        serviceToken: string,
        alias: StringKey<P>,
    ): this {
        this.define(() => this[serviceToken], alias);

        return this;
    }

    /**
     * load services from sourceContext to current context with the same tokens, previous context state will be saved to backup
     * @param sourceContext - source context instance
     */
    public loadWithBackup<T>(sourceContext: DiContainer): void {
        this.backup.update();
        this.load(sourceContext);
    }

    /**
     * remove all services from cache
     */
    public clearCache(): void {
        this.cache = new Map();
    }

    /**
     * restore previous context state form backup
     */
    public restoreBackup(): void {
        this.backup.restore();
    }

    /**
     * load services of classes which match the current path masks
     * @param path - list of file path mask
     */
    public loadClassesByPath(...path: string[]) {
        const classes = importClassesByPath(path)
            .filter(it => it.name.length > 0)
            .sort(it => it.name[0] === 'I' ? -1 : 0);

        classes.forEach(item => this.add(item as Class));
    }

    /**
     * load services from source context to current with the same tokens
     * @param tokens - specify tokens with will be loaded, if empty - all
     */
    public load<T>(sourceContext: LoadedContext<T>, tokens?: string[]): this & LoadedContext<T> {
        const tokenList = isEmpty(tokens)
            ? sourceContext.tokens
            : sourceContext.tokens.filter(tkn => tokens!.includes(tkn));

        tokenList.forEach(id => {
            this.tokenSet.add(id);
            this.define(() => sourceContext[id], id);
        });

        entriesFrom(sourceContext.classGetterNames)
            .filter(([cls, tkn]) => tokenList.includes(tkn))
            .forEach(([cls, tkn]) => this.classGetterNames.set(cls, tkn));

        sourceContext.cache.forEach((instance, tkn) => this.cache.set(tkn, instance));

        return this as this & LoadedContext<T>;
    }

    /**
     * return instance of type associated with typeToken
     * @param typeToken
     */
    public get<T extends TypeToken>(typeToken: T): GetResult<T> {
        const token = this.classGetterNames.get(typeToken) ?? this.getterNameFor(typeToken);

        return this[token] as GetResult<T>;
    }

    /**
     * return instances of all classes with were marked by current marker
     * @param marker
     */
    public getMarkedBy<T extends TypeToken>(marker: T): Set<T> {
        return (this.marked.get(marker) ?? new Set()) as Set<T>;
    }

    /**
     * return true if context contain service with current token
     * @param tokenOrType service token
     */
    public has(tokenOrType: string | TypeToken): boolean {
        return isString(tokenOrType) ? this.tokenSet.has(tokenOrType) : this.hasInstanceOf(tokenOrType);
    }

    /**
     * inject dependencies to instance
     */
    public inject<T>(instance: T): T {
        this.injectionStrategies.forEach(strategy => strategy.inject(instance));
        return instance;
    }

    private hasInstanceOf(token: TypeToken) {
        return keysFrom(this.classGetterNames).includes(token) || this.tokenSet.has(this.getterNameFor(token));
    }

    private getArguments(func: ((...arg: unknown[]) => unknown) | Class, defaultArgNames?: string[]): PramsOf<typeof func> {
        if (isDefined(defaultArgNames)) {
            return defaultArgNames.map(alias => this[alias]);
        }

        const types: Optional<TypeToken[]> = Reflect.getMetadata('design:paramtypes', func);

        if (isNotEmpty(types)) {
            return types.map(token => token === Object ? this : this.get(token));
        }

        const argNames = getArgumentNames(func);
        const isWrappedArg = (name: string) => name.includes('{');

        if (isEmpty(argNames)) {
            return [];
        }

        return argNames.map(name => isWrappedArg(name) ? this.context : this[name]);
    }

    private setToken(cls: Optional<TypeToken>, alias: string, sourceName: string) {
        if (isNil(cls)) {
            return;
        }

        if (this.classGetterNames.has(cls)) {
            const getter = this.classGetterNames.get(cls)!;
            const implementation = this[getter];
            const message = `${sourceName} can't be loaded, ${getTypeName(cls)} implementation is already defined: ${toString(implementation)}`;
            console.error(message);
            throw new Error(message);
        }

        this.classGetterNames.set(cls, alias);
    }

    private createClassGetter({ cls, alias, args, cache }: ClassGetterCreationParams) {
        return this.createGetter(
            alias,
            () => this.inject(new cls(...this.getArguments(cls , args))),
            cache,
        );
    }

    private createFactoryGetter({ factory, alias, args, cache }: FactoryGetterCreationParams) {
        return this.createGetter(
            alias,
            () => {
                const theFactory = this.getFactory(factory);
                const factoryFunc = isFunction(theFactory) ? theFactory : (args: any[]) => (theFactory as Factory).create(...args);
                const created = factoryFunc(...this.getArguments(factoryFunc, args));

                return this.inject(created);
            },
            cache,
        );
    }

    private createValueGetter(component: unknown, alias: string) {
        return this.createGetter(alias, () => component, true);
    }

    private createGetter(alias: string, callback: Function, cache: boolean) {
        return cache
            ? () => {
                if (!this.cache.has(alias)) {
                    this.cache.set(alias, callback());
                }

                return this.cache.get(alias);
            }
            : () => callback();
    }

    private getFactory(factory: Factory | Function | string): Factory | Function {
        return isString(factory)
            ? this[factory] as Factory | Function
            : factory;
    }

    private extractTypes(instanceOrClass: object): TypeToken[] {
        return compact(this.typeExtractors.flatMap(extract => extract(instanceOrClass)));
    }

    private extractMarkers(aClass: Class): MarkerInterface[] {
        return this.markerExtractors.flatMap(extract => [...extract(aClass)]);
    }

    private addMarkers(aClass: Class, markers: MarkerInterface[]): void {
        markers.forEach(marker => this.getMarkedClasses(marker).add(aClass));
    }

    private getMarkedClasses(marker: MarkerInterface) {
        if (!this.marked.has(marker)) {
            this.marked.set(marker, new Set());
        }

        return this.marked.get(marker)!;
    }

    private define(getter: Getter, alias: string) {
        Object.defineProperty(this, alias, {
            get: getter,
            enumerable: true,
            configurable: true,
        });

        this.tokenSet.add(alias);
    }

    private getterNameFor(item: TypeToken | object): string {
        const type = isSymbol(item) ? item : this.extractTypes(item)[0];

        return nameOf(type);
    }

    private createBackup(): Backup {
        const data: BackupData = {
            cache: new Map(),
            classTokens: new Map(),
            tokenSet: new Set(),
            getFuncs: new Map(),
        };

        const deleteGetterIfNotExistsInBackup = (key: string) => {
            if (!data.tokenSet.has(key)) {
                delete this[key];
            }
        };

        const restoreGetterFor = (getterName: string) => {
            const backupFunc = data.getFuncs.get(getterName)!;

            if (backupFunc !== this.getterFor(getterName)) {
                this.define(backupFunc, getterName);
            }
        };

        return {
            update: () => {
                this.cache.keys();
                data.cache = new Map(this.cache);
                data.classTokens = new Map(this.classGetterNames);
                data.tokenSet = new Set(this.tokenSet);
                data.getFuncs = new Map(this.tokens.map(tkn => [tkn, this.getterFor(tkn)]));
            },
            restore: () => {
                this.cache = new Map(data.cache);
                this.classGetterNames = new Map(data.classTokens);
                this.tokenSet.forEach(tkn => deleteGetterIfNotExistsInBackup(tkn));
                this.tokenSet = new Set(data.tokenSet);
                data.getFuncs.forEach((fn, getterName) => restoreGetterFor(getterName));
            },
        };
    }

    private getterFor(getterName: string): Getter {
        const descriptor = Object.getOwnPropertyDescriptor(this, getterName);

        if (isUndefined(descriptor)) {
            throw new Error(`property descriptor is undefined, token: ${getterName}`);
        }

        if (isUndefined(descriptor.get)) {
            throw new Error(`getter in property descriptor is undefined, token: ${getterName}`);
        }

        return descriptor.get;
    }

}

const toString = (source: any): string =>
    isFunction(source) ? source.name :
    isDefined(source.constructor) ? `instance of ${source.constructor.name}` :
    isFunction(source.toString) ? source.toString() :
    'unknown component';

const getTypeName = (serviceType: TypeToken) =>
    typeof serviceType === 'symbol'
        ? serviceType.description
        : (serviceType as Function).name;

const createDiFactory = (ctx: DiContainer): DiFactory => {
    const create = <T, U extends unknown[]>(ctor: Class<T, unknown[]>, ...params: U): T => {
        const instance = new ctor(...params);
        ctx.inject(instance);

        return instance;
    };

    return { create };
};

export {
    DiContainer,
};
