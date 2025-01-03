import { NftWalletMock } from '.';
import { ipfs_gateway } from '../../test/env-ipfs-gateway';

import request from 'supertest';

describe('NftWalletMock', () => {
    it('should return totalSupply(id=2202100) = 0', async () => {
        const nft = new NftWalletMock(0n);
        const supply = await nft.totalSupply('2202100');
        expect(supply === 0n).toBeTruthy();
    });
    it('should return year() >= 2021', async () => {
        const nft = new NftWalletMock(0n);
        const year = await nft.year();
        expect(year >= 2021).toBeTruthy();
    });
    it('should return uri(id=2202100)', async () => {
        const nft = new NftWalletMock(0n);
        const uri = await nft.uri('2202100');
        expect(uri).toBeDefined();
    });
    it('should return idBy(year=2021, level=0)', async () => {
        const nft = new NftWalletMock(0n);
        const id = await nft.idBy(2021, 0);
        expect(id === '2202100').toBeTruthy();
    });
});
describe('NftWalletMock', () => {
    const year = new Date().getFullYear();
    it(`should fetch & validate uri(id=${year}03)`, async () => {
        const nft = new NftWalletMock(0n);
        const uri = await nft.uri(nft.idBy(year, 3));
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toMatch(/^KILO [A-Z]{4}/);
                expect(json.description).toMatch(/^Stakeable KILO [A-Z]{4} NFT/);
                expect(json.external_url).toMatch(/^https:\/\/www\.xpowermine\.com\/nfts\?token=[A-Z]{4}$/)
                expect(json.image).toMatch(new RegExp(`${year}/2-KILO.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
});
