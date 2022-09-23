import { range } from '../../functions';
import { Level } from './nonces';

export class MinterRows {
    private static get levels() {
        return Array.from(range(1, 65)) as Level[];
    }
    static init(min_level: Level) {
        return this.levels.map((level) => this.empty({
            display: level === min_level
        }));
    }
    static empty(
        row: Partial<MinterRow> = {}
    ) {
        return {
            status: null,
            disabled: true,
            display: false,
            nn_counter: 0,
            tx_counter: 0,
            ...row
        };
    }
    static get(
        rows: MinterRow[], index: number
    ) {
        if (index >= rows.length) {
            throw new Error('index out-of-range');
        }
        return rows[index];
    }
    static set(
        rows: MinterRow[], index: number, new_row: Partial<MinterRow>
    ) {
        return rows.map((row, i) =>
            (index !== i) ? { ...row } : { ...row, ...new_row }
        );
    }
}
export type MinterRow = {
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
    rows: MinterRow[];
};
