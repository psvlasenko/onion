import 'reflect-metadata';

const markers = Symbol('interface markers metadata key');

function markAs<T extends Function>(interface1: T): (target: { prototype: T['prototype'] }) => void;
function markAs<
    T extends Function,
    U extends Function
>(interface1: T, interface2: U): (target: { prototype: T['prototype'] & U['prototype'] }) => void;
function markAs<
    T extends Function,
    U extends Function,
    Q extends Function
>(interface1: T, interface2: U, interface3: Q): (target: { prototype: T['prototype'] & U['prototype'] & Q['prototype'] }) => void;
function markAs(...interfaces: Function[]): (target: any) => void {
    return (target) => {
        const proto = target.prototype;
        if (!Reflect.hasMetadata(markers, proto)) {
            Reflect.defineMetadata(markers, new Set<Function>(), proto);
        } else if (
            Reflect.hasMetadata(markers, proto)
            && !Reflect.hasOwnMetadata(markers, proto)
        ) {
            Reflect.defineMetadata(
                markers,
                new Set(Reflect.getMetadata(markers, proto)),
                proto,
            );
        }

        const theMarkers: Set<Function> = Reflect.getMetadata(markers, proto);
        interfaces.forEach(it => theMarkers.add(it));
    };
}

function getMarkers(target: object): Set<Function> {
    return Reflect.getMetadata(markers, Object.getPrototypeOf(target)) ?? new Set();
}

export {
    markAs,
    markers as markersMetadataKey,
    getMarkers,
};
