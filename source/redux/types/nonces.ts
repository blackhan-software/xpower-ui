import { Address, Amount } from './base';

export type BlockHash = bigint;
export type Interval = number;
export type Nonce = number;
export type Nonces = {
    /** nonce => { address, block-hash, amount } */
    items: {
        [nonce: Nonce]: {
            address: Address,
            block_hash: BlockHash,
            amount: Amount
        };
    };
    /** set for added nonce(s) */
    more?: Nonce[];
    /** set for removed nonce(s) */
    less?: Nonce[];
};
