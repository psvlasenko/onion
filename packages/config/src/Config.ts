import { validate } from 'class-validator';

abstract class Config {

    public async validate(): Promise<void> {
        const errors = await validate(this);

        if (errors.length !== 0) {
            throw new Error(`Config validation failed. Config: ${this.getName()}, errors: ${JSON.stringify(errors)}`);
        }
    }

    public abstract getName(): string;

    public getDefaults(): object {
        return {};
    }

}

export {
    Config,
};
