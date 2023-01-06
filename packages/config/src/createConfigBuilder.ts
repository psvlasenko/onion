import { camelCase } from 'lodash';
import deepExtend from 'deep-extend';
import fs from 'fs';
import { plainToClassFromExist } from 'class-transformer';

import type { Class } from '@onion/types';

import { Config } from './Config';

type Builder = () => Promise<ConfigDictionary>;

type ConfigDictionary  = { [key: string]: Config };

interface ConfigBuilder {
    buildParallel: Builder;
    buildConsequently: Builder;
}

interface ConfigBuilderParams {
    configDir: string;
    env: string;
    configClasses: Class<Config>[];
}

const createConfigBuilder = ({ configDir, env, configClasses }: ConfigBuilderParams): ConfigBuilder => {
    const source = createConfigFileChain({ configDir, env });

    const createConfig = createConfigFactory(source);

    const buildParallel: Builder = async() => {
        const createConfigEntry = async (configClass: Class<Config>): Promise<[string, Config]> => {
            const config = await createConfig(configClass);

            return [camelCase(configClass.name), config];
        }

        const configEntries = await Promise.all(configClasses.map(it => createConfigEntry(it)));

        return Object.fromEntries(configEntries);
    }

    const buildConsequently: Builder = async() => {
        const configs: ConfigDictionary = {};

        for (const cfgClass of configClasses) {
            configs[camelCase(cfgClass.name)] = await createConfig(cfgClass);
        }

        return configs;
    }

    return {
        buildParallel,
        buildConsequently,
    }

}

type ConfigFactory = <T extends Config>(configClass: Class<T>) => Promise<T>;

type ConfigSource = (name: string, defaults: object) => object;

const createConfigFactory = (getConfig: ConfigSource): ConfigFactory =>
    async configClass => {
        const config = new configClass();

        plainToClassFromExist(
            config,
            getConfig(config.getName(), config.getDefaults()),
        );

        await config.validate();

        return config;
    };

type ConfigFileChainCreationParams = {
    configDir: string;
    env: string;
}

const createConfigFileChain = ({ configDir, env }: ConfigFileChainCreationParams): ConfigSource => {

    const getConfigFileChain = (name: string): string[] => [
        `${configDir}/base/${name}.json`,
        `${configDir}/base/${name}.js`,
        `${configDir}/${env}/${name}.json`,
        `${configDir}/${env}/${name}.js`,
        `${configDir}/local/${name}.json`,
        `${configDir}/local/${name}.js`,
    ];

    return (name, defaults) => deepExtend.apply(
        undefined,
        [defaults, ...getConfigFileChain(name).map(filePath => read(filePath))],
    );
}

const read = (configPath: string): unknown => fs.existsSync(configPath) ? require(configPath) : {};

export {
    createConfigBuilder,
    ConfigBuilderParams,
    ConfigDictionary,
};
