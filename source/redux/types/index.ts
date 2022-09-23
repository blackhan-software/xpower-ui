export * from './base';
export * from './mining';
export * from './minting';
export * from './nfts';
export * from './nfts-ui';
export * from './nonces';
export * from './page';
export * from './ppts-ui';
export * from './refresh';
export * from './tokens';

import { Page } from './page';
import { Mining } from './mining';
import { Minting } from './minting';
import { Nfts } from './nfts';
import { NftsUi } from './nfts-ui';
import { Nonces } from './nonces';
import { PptsUi } from './ppts-ui';
import { Refresh } from './refresh';
import { Token, Tokens } from './tokens';

export type State = {
    page: Page,
    mining: Mining,
    minting: Minting,
    nfts: Nfts,
    nfts_ui: NftsUi,
    ppts: Nfts,
    ppts_ui: PptsUi,
    nonces: Nonces,
    refresh: Refresh,
    token: Token,
    tokens: Tokens,
};
export function Empty<T extends {
    items: Record<string | number | symbol, unknown>
}>() {
    return { items: {} } as T;
}
