/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_nfts from './env-of-nfts';

describe('env_of_nfts', () => {
    it('should return env-of-nfts request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_nfts(req as any)).toEqual({
            ...{
                NFT_UNIT_DISPLAY: 'none',
                NFT_KILO_DISPLAY: 'none',
                NFT_MEGA_DISPLAY: 'none',
                NFT_GIGA_DISPLAY: 'none',
                NFT_TERA_DISPLAY: 'none',
                NFT_PETA_DISPLAY: 'none',
                NFT_EXA_DISPLAY: 'none',
                NFT_ZETTA_DISPLAY: 'none',
                NFT_YOTTA_DISPLAY: 'none',
            }, ...{
                NFT_UNIT_CHEVRON: 'down',
                NFT_KILO_CHEVRON: 'down',
                NFT_MEGA_CHEVRON: 'down',
                NFT_GIGA_CHEVRON: 'down',
                NFT_TERA_CHEVRON: 'down',
                NFT_PETA_CHEVRON: 'down',
                NFT_EXA_CHEVRON: 'down',
                NFT_ZETTA_CHEVRON: 'down',
                NFT_YOTTA_CHEVRON: 'down',
            },
        });
    });
});
