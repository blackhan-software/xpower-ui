import { setNftsUi } from '../actions';
import { nftAmounts, nftDetails, nftFlags, nftMinter, nftsUiReducer, nftWrap } from './nfts-ui-reducer';

describe('Store w/nfts-ui-reducer', () => {
    it('should set nfts-ui [toggled==true]', () => {
        const state_0 = {
            amounts: nftWrap(nftAmounts()),
            details: nftWrap(nftDetails()),
            minter: nftWrap(nftMinter()),
            flags: nftFlags(),
            toggled: false,
            expanded: null
        };
        const state_1 = nftsUiReducer(state_0, setNftsUi({
            toggled: true
        }));
        expect(state_1.toggled).toEqual(true);
    });
    it('should set nfts-ui [toggled==false]', () => {
        const state_0 = {
            amounts: nftWrap(nftAmounts()),
            details: nftWrap(nftDetails()),
            minter: nftWrap(nftMinter()),
            flags: nftFlags(),
            toggled: true,
            expanded: null
        };
        const state_1 = nftsUiReducer(state_0, setNftsUi({
            toggled: false
        }));
        expect(state_1.toggled).toEqual(false);
    });
});
