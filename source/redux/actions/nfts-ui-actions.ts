import { DeepPartial } from 'redux';
import { NftsUi } from '../types/nfts-ui';

export type SetNftsUiAmounts = {
    type: 'nfts-ui/set-amounts',
    payload: DeepPartial<Pick<NftsUi, 'amounts'>>
};
export const setNftsUiAmounts = (
    payload: DeepPartial<Pick<NftsUi, 'amounts'>>
): SetNftsUiAmounts => ({
    type: 'nfts-ui/set-amounts', payload
});
export type SetNftsUiDetails = {
    type: 'nfts-ui/set-details',
    payload: DeepPartial<Pick<NftsUi, 'details'>>
};
export const setNftsUiDetails = (
    payload: DeepPartial<Pick<NftsUi, 'details'>>
): SetNftsUiDetails => ({
    type: 'nfts-ui/set-details', payload
});
export type SetNftsUiMinter = {
    type: 'nfts-ui/set-minter',
    payload: DeepPartial<Pick<NftsUi, 'minter'>>
};
export const setNftsUiMinter = (
    payload: DeepPartial<Pick<NftsUi, 'minter'>>
): SetNftsUiMinter => ({
    type: 'nfts-ui/set-minter', payload
});
export type SetNftsUiFlags = {
    type: 'nfts-ui/set-flags',
    payload: DeepPartial<Pick<NftsUi, 'flags'>>
};
export const setNftsUiFlags = (
    payload: DeepPartial<Pick<NftsUi, 'flags'>>
): SetNftsUiFlags => ({
    type: 'nfts-ui/set-flags', payload
});
export type SetNftsUiToggled = {
    type: 'nfts-ui/set-toggled',
    payload: DeepPartial<Pick<NftsUi, 'toggled'>>
};
export const setNftsUiToggled = (
    payload: DeepPartial<Pick<NftsUi, 'toggled'>>
): SetNftsUiToggled => ({
    type: 'nfts-ui/set-toggled', payload
});
export type SetNftsUi = {
    type: 'nfts-ui/set',
    payload: DeepPartial<NftsUi>
};
export const setNftsUi = (
    payload: DeepPartial<NftsUi>
): SetNftsUi => ({
    type: 'nfts-ui/set', payload
});
export type Action =
    SetNftsUiAmounts |
    SetNftsUiDetails |
    SetNftsUiMinter |
    SetNftsUiFlags |
    SetNftsUiToggled |
    SetNftsUi;
