import { address } from '../../../test/env-address';
import { XPowerNft } from './xpower-nft';

describe('XPowerNft', () => {
    it('should be constructible', () => {
        const xpower_nft = new XPowerNft(address({
            infix: 'NFT', token: 'XPOW'
        }));
        expect(xpower_nft).toBeDefined();
    });
});
