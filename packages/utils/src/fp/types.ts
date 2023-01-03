import { DefaultIdentity, Optional } from '@onion/types';

export type Unary<T = unknown, U = unknown> = (arg: T) => U | Promise<U>;

export type SaveMethod<Entity> = {
    (entity: Entity): Promise<void>;
    (entityList: Entity[]): Promise<void>;
    (entityList: Entity | Entity[]): Promise<void>;
};

export interface Repository<Entity, Id = DefaultIdentity<Entity>, FO extends object = {}> {
    save: SaveMethod<Entity>;
    get(identity: Id): Promise<Optional<Entity>>;
    getOrFail(identity: Id): Promise<Entity>;
    find(option?: FO): Promise<Entity[]>;
}
