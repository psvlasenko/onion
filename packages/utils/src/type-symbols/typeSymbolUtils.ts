import assert from 'assert';
import { has } from 'ramda';

import { Optional } from '@onion/types';

type Common = {
    path?: string;
};

type NewSymbolMetadata = Common & { description: string; };
type ExistedSymbolMetadata = Common & { usingSymbol: symbol; };
type Metadata = NewSymbolMetadata | ExistedSymbolMetadata;
type TypeSymbol<T = unknown> = symbol & T;

const isExitedSymbolMetadata = (metadata: Metadata): metadata is ExistedSymbolMetadata => has('usingSymbol', metadata);
const symbolMetadata = new Map<symbol, Metadata>();
const symbolDescriptions = new Set<string>();

const getSymbol = (metadata: Metadata) => {
    if (isExitedSymbolMetadata(metadata)) {
        return metadata.usingSymbol;
    }

    const { description } = metadata;
    assert.ok(!symbolDescriptions.has(description), `symbol type already exists: ${description}`);
    symbolDescriptions.add(description);

    return Symbol(description);
};

const createTypeSymbol = <T>(metadata: Metadata): abstract new (...arg: any[]) => T => {
    const result = getSymbol(metadata);
    symbolMetadata.set(result, metadata);

    return result as any;
}

const getTypeSymbolMetadata = (smbl: symbol): Optional<Metadata> => symbolMetadata.get(smbl);

const getTypeSymbolMetadataOrFail = (smbl: symbol): Metadata => {
    assert.ok(
        symbolMetadata.has(smbl),
        `symbol: ${smbl.toString()} haven't been defined by "${createTypeSymbol.name}"`,
    );

    return symbolMetadata.get(smbl)!;
};

export {
    TypeSymbol,
    createTypeSymbol,
    getTypeSymbolMetadata,
    getTypeSymbolMetadataOrFail,
};
