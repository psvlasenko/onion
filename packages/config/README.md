# NodeJS application configuration files loader

* NodeJS, Typescript, typed configs
* Config chaining (hierarchy)
* Multiple environments support, local overwrites
* JSON/JS configs, JS is to use environment variables
* Validation using class-validator library

## Usage
config example:
```typescript
export class ExampleConfig extends Config {

    @IsNotEmpty()
    public value!: string;

    public getName(): string {
        return 'example';
    }

}
```

Configs loading:
```typescript
const builder = createConfigBuilder({
    configDir: 'PATH_TO_CONFIG_FOLDER';
    env: process.env.MY_APP_ENV;
    configClasses:[ExampleConfig];
});

const configs = builder.buildParallel(); // -- { exampleConfig: ExampleConfig {} }
```
