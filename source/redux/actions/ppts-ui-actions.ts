import { createAction } from '@reduxjs/toolkit';
import { DeepPartial, PptsUi } from '../types';

export const setPptsUiAmounts = createAction('ppts:ui/set-amounts', (
    ppts_ui: DeepPartial<Pick<PptsUi, 'amounts'>>
) => ({
    payload: ppts_ui
}));
export const setPptsUiDetails = createAction('ppts:ui/set-details', (
    ppts_ui: DeepPartial<Pick<PptsUi, 'details'>>
) => ({
    payload: ppts_ui
}));
export const setPptsUiMinter = createAction('ppts:ui/set-minter', (
    ppts_ui: DeepPartial<Pick<PptsUi, 'minter'>>
) => ({
    payload: ppts_ui
}));
export const setPptsUiFlags = createAction('ppts:ui/set-flags', (
    ppts_ui: DeepPartial<Pick<PptsUi, 'flags'>>
) => ({
    payload: ppts_ui
}));
export const setPptsUiToggled = createAction('ppts:ui/set-toggled', (
    ppts_ui: DeepPartial<Pick<PptsUi, 'toggled'>>
) => ({
    payload: ppts_ui
}));
export const setPptsUi = createAction('ppts:ui/set', (
    ppts_ui: DeepPartial<PptsUi>
) => ({
    payload: ppts_ui
}));
