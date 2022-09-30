export * from './base';
export * from './mining';
export * from './minting';
export * from './nfts';
export * from './nfts-ui';
export * from './nonces';
export * from './page';
export * from './ppts-ui';
export * from './refresh';
export * from './token';
export * from './aft-wallet';
export * from './otf-wallet';

import { Page } from './page';
import { Token } from './token';
import { Mining } from './mining';
import { Minting } from './minting';
import { Nfts } from './nfts';
import { NftsUi } from './nfts-ui';
import { Nonces } from './nonces';
import { PptsUi } from './ppts-ui';
import { Refresh } from './refresh';
import { AftWallet } from './aft-wallet';
import { OtfWallet } from './otf-wallet';

export type State = {
    page: Page,
    token: Token,
    mining: Mining,
    minting: Minting,
    nfts: Nfts,
    nfts_ui: NftsUi,
    ppts: Nfts,
    ppts_ui: PptsUi,
    nonces: Nonces,
    refresh: Refresh,
    aft_wallet: AftWallet,
    otf_wallet: OtfWallet,
};
export function Empty<T extends {
    items: Record<string | number | symbol, unknown>
}>() {
    return { items: {} } as T;
}
