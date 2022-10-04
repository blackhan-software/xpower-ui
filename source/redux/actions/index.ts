export * from './page-actions';
export * from './mining-actions';
export * from './minting-actions';
export * from './nonces-actions';
export * from './nfts-actions';
export * from './nfts-ui-actions';
export * from './ppts-actions';
export * from './ppts-ui-actions';
export * from './refresh-actions';
export * from './token-actions';
export * from './aft-wallet-actions';
export * from './otf-wallet-actions';

import { Action as NftsAction } from './nfts-actions';
import { Action as NftsUiAction } from './nfts-ui-actions';
import { Action as PptsAction } from './ppts-actions';
import { Action as PptsUiAction } from './ppts-ui-actions';

export type Action =
    NftsAction |
    NftsUiAction |
    PptsAction |
    PptsUiAction
;
