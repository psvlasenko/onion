abstract class InitializableData {

    protected isInitialized = false;

    public async init(): Promise<this> {
        await this.initialize();
        this.isInitialized = true;
        return this;
    }

    protected abstract initialize(): Promise<void>;

    protected checkInitialization() {
        if (!this.isInitialized) {
            throw new Error('Initializable data is not initialized');
        }
    }

}

export {
    InitializableData,
};
