import { createAction } from '@reduxjs/toolkit';
import { DeepPartial } from 'redux';
import { NftsUi } from '../types/nfts-ui';

export const setNftsUiAmounts = createAction('nfts:ui/set-amounts', (
    nfts_ui: DeepPartial<Pick<NftsUi, 'amounts'>>
) => ({
    payload: nfts_ui
}));
export const setNftsUiDetails = createAction('nfts:ui/set-details', (
    nfts_ui: DeepPartial<Pick<NftsUi, 'details'>>
) => ({
    payload: nfts_ui
}));
export const setNftsUiMinter = createAction('nfts:ui/set-minter', (
    nfts_ui: DeepPartial<Pick<NftsUi, 'minter'>>
) => ({
    payload: nfts_ui
}));
export const setNftsUiFlags = createAction('nfts:ui/set-flags', (
    nfts_ui: DeepPartial<Pick<NftsUi, 'flags'>>
) => ({
    payload: nfts_ui
}));
export const setNftsUiToggled = createAction('nfts:ui/set-toggled', (
    nfts_ui: DeepPartial<Pick<NftsUi, 'toggled'>>
) => ({
    payload: nfts_ui
}));
export const setNftsUi = createAction('nfts:ui/set', (
    nfts_ui: DeepPartial<NftsUi>
) => ({
    payload: nfts_ui
}));
