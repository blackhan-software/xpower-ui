export type Address = string;
export type Nonce = string;
export type Amount = number;
export type Refresh = {
    /** set on dispatching refresh */
    date: string | null
};
export type Nonces = {
    /** nonce => { address, amount } */
    items: {
        [nonce: Nonce]: {
            address: Address,
            amount: Amount
        }
    },
    /** set for added nonce(s) */
    more?: Nonce[],
    /** set for removed nonce(s) */
    less?: Nonce[]
};
export type State = {
    refresh: Refresh,
    nonces: Nonces
};
