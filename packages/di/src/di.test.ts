import 'reflect-metadata';

import { implementationOf, reflected } from '@onion/utils';
import { DiContainer } from './DiContainer';
import { createInjectDecorator } from './utils';

const emptyDecorator = (...args: unknown[]) => {};

/* tslint:disable:max-classes-per-file */
class Injectable {
}

describe('DiContainer test suite', () => {
    it('decorated class constructor injection', () => {
        @emptyDecorator
        class Service {
            public service: Injectable;

            constructor(anyName: Injectable) {
                this.service = anyName;
            }
        }

        const di = new DiContainer();
        di.add(Service);
        di.add(Injectable);
        const instance = di.get(Service);

        expect(instance?.service).toBeInstanceOf(Injectable);
    });

    it('decorated setter injection', () => {
        class Service {

            public service!: Injectable;

            @emptyDecorator
            protected set anyName(anyName: Injectable) {
                this.service = anyName;
            }

        }

        const di = new DiContainer();
        di.add(Service);
        di.add(Injectable);
        const instance = di.get(Service);

        expect(instance?.service).toBeInstanceOf(Injectable);
    });

    it('decorated setter injection with defined interface metadata', () => {
        abstract class IInjectable {}

        @implementationOf(IInjectable)
        class InjectableService implements IInjectable {}

        class ServiceWithSetterInjection {

            public service!: IInjectable;

            @emptyDecorator
            protected set anyName(anyName: IInjectable) {
                this.service = anyName;
            }

        }

        @emptyDecorator
        class ServiceWithConstructorInjection {

            public service: IInjectable;

            constructor(anyName: IInjectable) {
                this.service = anyName;
            }
        }

        const di = new DiContainer();
        di.add(InjectableService);
        di.add(ServiceWithSetterInjection);
        di.add(ServiceWithConstructorInjection);
        const instanceWithSetterInjection = di.get(ServiceWithSetterInjection);
        const instanceWithConstructorInjection = di.get(ServiceWithConstructorInjection);

        expect(instanceWithSetterInjection?.service).toBeInstanceOf(InjectableService);
        expect(instanceWithConstructorInjection?.service).toBeInstanceOf(InjectableService);
    });

    it('annotation injection with defined interface metadata', () => {
        abstract class IInjectable {}

        @implementationOf(IInjectable)
        class InjectableService implements IInjectable {}

        class Service {

            @reflected
            public service!: IInjectable;

        }

        const di = new DiContainer();
        di.add(InjectableService);
        di.add(Service);
        const instance = di.get(Service);

        expect(instance?.service).toBeInstanceOf(InjectableService);
    });

    it('annotation injection with defined multiple interface metadata', () => {
        abstract class IInjectable {}
        abstract class IOtherInterface {}

        @implementationOf(IInjectable, IOtherInterface)
        class InjectableService implements IInjectable {}

        class Service1 {

            @reflected
            public service!: IInjectable;

        }

        class Service2 {

            @reflected
            public service!: IOtherInterface;

        }

        class Service3 {

            @reflected
            public service!: InjectableService;

        }

        const di = new DiContainer();
        di.add(InjectableService);
        di.add(Service1);
        di.add(Service2);
        di.add(Service3);
        const instance1 = di.get(Service1);
        const instance2 = di.get(Service2);
        const instance3 = di.get(Service3);

        expect(instance1?.service).toBeInstanceOf(InjectableService);
        expect(instance2?.service).toBeInstanceOf(InjectableService);
        expect(instance3?.service).toBeInstanceOf(InjectableService);
    });

    // this variant is not compatible with code minification
    it('constructor arguments injection', () => {
        class Service {
            public service: Injectable;

            // constructor arguments names must be as type name without "I" prefix in camelCase notation
            constructor(injectable: Injectable) {
                this.service = injectable;
            }
        }

        const di = new DiContainer();
        di.add(Service);
        di.add(Injectable);
        const instance = di.get(Service);

        expect(instance?.service).toBeInstanceOf(Injectable);
    });

    it('wrapped to object literal constructor arguments injection', () => {
        interface Dependencies {
            // wrapped argument keys must be as type name without "I" prefix in camelCase notation
            injectable: Injectable;
        }

        class Service {
            public service: Injectable;

            constructor({ injectable }: Dependencies) {
                this.service = injectable;
            }
        }

        const di = new DiContainer();
        di.add(Service);
        di.add(Injectable);
        const instance = di.get(Service);

        expect(instance?.service).toBeInstanceOf(Injectable);
    });

    it('setter injection', () => {
        class Service {
            public service!: Injectable;

            // setter name must be as type name without "I" prefix in camelCase notation
            protected set injectable(anyName: Injectable) {
                this.service = anyName;
            }
        }

        const di = new DiContainer();
        di.add(Service);
        di.add(Injectable);
        const instance = di.get(Service);

        expect(instance?.service).toBeInstanceOf(Injectable);
    });

    it('usage as service locator', () => {
        abstract class IInjectable {}
        class Injectable implements IInjectable {}

        const di = new DiContainer();
        const inject = createInjectDecorator(di);

        class Service {
            /**
             * Injectable service class name must be the same as interface name without "I",
             * or property key must be as the injectable service class name in camelCase notation
             */
            @inject
            public service!: IInjectable; // or public injectable: any;

        }

        di.add(Injectable);

        const instance = new Service();
        expect(instance.service).toBeInstanceOf(Injectable);
    });

    it('usage as service locator with defined interface metadata', () => {
        abstract class IInjectable {}

        @implementationOf(IInjectable)
        class InjectableService implements IInjectable {}

        const di = new DiContainer();
        const inject = createInjectDecorator(di);

        class Service {

            @inject
            public anyName!: IInjectable;

        }

        di.add(InjectableService);

        const instance = new Service();
        expect(instance.anyName).toBeInstanceOf(InjectableService);
    });

});
