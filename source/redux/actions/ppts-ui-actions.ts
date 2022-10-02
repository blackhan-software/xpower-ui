import { DeepPartial } from 'redux';
import { PptsUi } from '../types/ppts-ui';

export type SetPptsUiAmounts = {
    type: 'ppts-ui/set-amounts',
    payload: DeepPartial<Pick<PptsUi, 'amounts'>>
};
export const setPptsUiAmounts = (
    payload: DeepPartial<Pick<PptsUi, 'amounts'>>
): SetPptsUiAmounts => ({
    type: 'ppts-ui/set-amounts', payload
});
export type SetPptsUiDetails = {
    type: 'ppts-ui/set-details',
    payload: DeepPartial<Pick<PptsUi, 'details'>>
};
export const setPptsUiDetails = (
    payload: DeepPartial<Pick<PptsUi, 'details'>>
): SetPptsUiDetails => ({
    type: 'ppts-ui/set-details', payload
});
export type SetPptsUiMinter = {
    type: 'ppts-ui/set-minter',
    payload: DeepPartial<Pick<PptsUi, 'minter'>>
};
export const setPptsUiMinter = (
    payload: DeepPartial<Pick<PptsUi, 'minter'>>
): SetPptsUiMinter => ({
    type: 'ppts-ui/set-minter', payload
});
export type SetPptsUiFlags = {
    type: 'ppts-ui/set-flags',
    payload: DeepPartial<Pick<PptsUi, 'flags'>>
};
export const setPptsUiFlags = (
    payload: DeepPartial<Pick<PptsUi, 'flags'>>
): SetPptsUiFlags => ({
    type: 'ppts-ui/set-flags', payload
});
export type SetPptsUiToggled = {
    type: 'ppts-ui/set-toggled',
    payload: DeepPartial<Pick<PptsUi, 'toggled'>>
};
export const setPptsUiToggled = (
    payload: DeepPartial<Pick<PptsUi, 'toggled'>>
): SetPptsUiToggled => ({
    type: 'ppts-ui/set-toggled', payload
});
export type SetPptsUi = {
    type: 'ppts-ui/set',
    payload: DeepPartial<PptsUi>
};
export const setPptsUi = (
    payload: DeepPartial<PptsUi>
): SetPptsUi => ({
    type: 'ppts-ui/set', payload
});
export type Action =
    SetPptsUiAmounts |
    SetPptsUiDetails |
    SetPptsUiMinter |
    SetPptsUiFlags |
    SetPptsUiToggled |
    SetPptsUi;
