export interface IInitializable {
    init(): Promise<void> | void;
}
