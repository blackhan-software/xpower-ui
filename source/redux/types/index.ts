export * from './aft-wallet';
export * from './base';
export * from './mining';
export * from './minting';
export * from './nfts';
export * from './nfts-ui';
export * from './nonces';
export * from './otf-wallet';
export * from './page';
export * from './ppts-ui';
export * from './refresh';
export * from './token';

import { AftWallet } from './aft-wallet';
import { Mining } from './mining';
import { Minting } from './minting';
import { Nfts } from './nfts';
import { NftsUi } from './nfts-ui';
import { Nonces } from './nonces';
import { OtfWallet } from './otf-wallet';
import { Page } from './page';
import { PptsUi } from './ppts-ui';
import { Refresh } from './refresh';
import { Token } from './token';

export type State = {
    aft_wallet: AftWallet;
    mining: Mining;
    minting: Minting;
    nfts: Nfts;
    nfts_ui: NftsUi;
    nonces: Nonces;
    otf_wallet: OtfWallet;
    page: Page;
    ppts: Nfts;
    ppts_ui: PptsUi;
    refresh: Refresh;
    token: Token;
};
export function Empty<T extends {
    items: Record<string | number | symbol, unknown>
}>() {
    return { items: {} } as T;
}
