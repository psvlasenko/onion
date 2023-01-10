export abstract class InstanceInjectionStrategy {

    protected diContainer: { [key: string]: any };

    constructor(container: { [key: string]: any }) {
        this.diContainer = container;
    }

    public abstract inject(instance: unknown): void;

}
