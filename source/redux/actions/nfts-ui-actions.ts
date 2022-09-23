import { DeepPartial } from 'redux';
import { NftsUi } from '../types/nfts-ui';

export type SetNftsUi = {
    type: 'nfts-ui/set', payload: DeepPartial<NftsUi>
};
export const setNftsUi = (payload: DeepPartial<NftsUi>): SetNftsUi => ({
    type: 'nfts-ui/set', payload
});
export type Action = SetNftsUi;
