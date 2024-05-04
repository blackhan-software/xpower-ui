import { createAction } from '@reduxjs/toolkit';
import { DeepPartial, Level, Minting, MintingRow } from '../types';

export const clearMintingRows = createAction(
    'minting/clear-rows'
);
export const clearMintingRow = createAction(
    'minting/clear-row', ({ level }: { level: Level }) => ({
        payload: { level }
    })
);
export const setMintingRow = createAction(
    'minting/set-row', ({ level, row }: {
        level: Level, row: Partial<MintingRow>
    }) => ({
        payload: { level, row }
    })
);
export const setMinting = createAction(
    'minting/set', (minting: DeepPartial<Minting>) => ({
        payload: minting
    })
);
