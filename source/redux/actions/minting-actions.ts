import { DeepPartial } from 'redux';
import { Level } from '../types';
import { Minting, MintingRow } from '../types/minting';

export type ClearMintingRows = {
    type: 'minting/clear-rows'
};
export const clearMintingRows = (
): ClearMintingRows => ({
    type: 'minting/clear-rows'
});
export type ClearMintingRow = {
    type: 'minting/clear-row',
    payload: { level: Level }
};
export const clearMintingRow = (
    payload: { level: Level }
): ClearMintingRow => ({
    type: 'minting/clear-row', payload
});
export type SetMintingRow = {
    type: 'minting/set-row',
    payload: { level: Level, row: Partial<MintingRow> }
};
export const setMintingRow = (
    payload: { level: Level, row: Partial<MintingRow> }
): SetMintingRow => ({
    type: 'minting/set-row', payload
});
export type SetMinting = {
    type: 'minting/set',
    payload: DeepPartial<Minting>
};
export const setMinting = (
    payload: DeepPartial<Minting>
): SetMinting => ({
    type: 'minting/set', payload
});
export type Action =
    ClearMintingRows | ClearMintingRow |
    SetMintingRow | SetMinting;
