import { Account, Amount } from './base';
import { Token } from './token';

export type BlockHash = bigint;
export type Interval = number;
export type Level = number;
export type Nonce = string;
export type Nonces = {
    /** nonce => { address, block-hash, amount } */
    items: {
        [nonce: Nonce]: {
            account: Account,
            amount: Amount,
            block_hash: BlockHash,
            token: Token,
        };
    };
    /** set for added nonce(s) */
    more?: Nonce[];
    /** set for removed nonce(s) */
    less?: Nonce[];
};
