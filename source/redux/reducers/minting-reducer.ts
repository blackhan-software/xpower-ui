import { Action } from '@reduxjs/toolkit';
import { range } from '../../functions';
import { ROParams } from '../../params';
import * as actions from '../actions';
import { Level, Minting, MintingRow } from '../types';

export function mintingReducer(
    minting: Minting = mintingState(), action: Action
): Minting {
    if (actions.clearMintingRows.match(action)) {
        return { ...minting, rows: init() };
    }
    if (actions.clearMintingRow.match(action)) {
        const { level } = action.payload
        const rows = set(minting.rows, level, empty());
        return { ...minting, rows };
    }
    if (actions.setMintingRow.match(action)) {
        const { level, row } = action.payload;
        const rows = set(minting.rows, level, row);
        return { ...minting, rows };
    }
    if (actions.setMinting.match(action)) {
        return $.extend(true, {}, minting, action.payload);
    }
    return minting;
}
export function mintingState() {
    return { rows: init() };
}
const set = (
    rows: Minting['rows'], level: Level, new_row: Partial<MintingRow>
): Minting['rows'] => {
    return { ...rows, [level]: { ...rows[level], ...new_row } };
};
const init = (
    min_level: Level = ROParams.level.min
): Minting['rows'] => {
    return Object.fromEntries(
        Array.from(range(1, 65)).map((l) => [l, empty({
            display: l === min_level
        })])
    );
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
