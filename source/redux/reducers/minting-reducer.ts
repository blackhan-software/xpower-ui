/* eslint @typescript-eslint/no-unused-vars: [off] */
import { App } from '../../app';
import { range } from '../../functions';
import { Action } from '../actions/minting-actions';
import { Level, Minting, MintingRow } from '../types';

export function mintingReducer(
    minting: Minting = mintingState(), action: Action
): Minting {
    switch (action.type) {
        case 'minting/clear-rows':
            return {
                ...minting, rows: init()
            };
        case 'minting/clear-row':
            return {
                ...minting, rows: set(
                    minting.rows, action.payload.level, empty()
                )
            };
        case 'minting/set-row':
            return {
                ...minting, rows: set(
                    minting.rows, action.payload.level, action.payload.row
                )
            };
        case 'minting/set':
            return $.extend(true, {}, minting, action.payload);
        default:
            return minting;
    }
}
export function mintingState() {
    return { rows: init() };
}
const set = (
    rows: Minting['rows'], level: Level, new_row: Partial<MintingRow>
): Minting['rows'] => {
    return rows.map((row, i) =>
        (level !== i + 1) ? { ...row } : { ...row, ...new_row }
    );
};
const init = (
    min_level: Level = App.level.min
): Minting['rows'] => {
    return Array.from(range(1, 65)).map((l) => empty({
        display: l === min_level
    }));
};
const empty = (
    row: Partial<MintingRow> = {}
): MintingRow => ({
    status: null,
    disabled: true,
    display: false,
    nn_counter: 0,
    tx_counter: 0,
    ...row
});
export default mintingReducer;
