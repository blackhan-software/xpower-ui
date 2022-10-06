import { Level } from "./nonces";

export type MintingRow = {
    status: MinterStatus | null;
    disabled: boolean;
    display: boolean;
    nn_counter: number;
    tx_counter: number;
};
export enum MinterStatus {
    minting = 'minting',
    minted = 'minted',
    error = 'error'
}
export type Minting = {
    /** set on dispatching minting */
    rows: Record<Level, MintingRow>;
};
