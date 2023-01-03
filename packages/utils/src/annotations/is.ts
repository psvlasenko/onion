import { Class } from '@onion/types';

import { getMarkers } from './markAs';

export function is(arg: any) {
    return {
        markedAs: (interfaceAsClass: Class | Function) => getMarkers(arg).has(interfaceAsClass),
    };
}
