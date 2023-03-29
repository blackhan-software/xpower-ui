import { ipfs_gateway } from '../../../test/env-ipfs-gateway';
import { XPowerNftMockFactory } from './xpower-nft-factory';
import { Token } from '../../redux/types';

import request from 'supertest';

describe('XPowerNftMockFactory', () => {
    it('should return totalSupply(id=1202100) = 0', async () => {
        const nft = await XPowerNftMockFactory({ token: Token.THOR });
        expect(nft.totalSupply(1202100) == 0).toBeTruthy();
    });
    it('should return year() >= 2021', async () => {
        const nft = await XPowerNftMockFactory({ token: Token.THOR });
        expect(nft.year() >= 2021).toBeTruthy();
    });
    it('should return uri(id=1202100)', async () => {
        const nft = await XPowerNftMockFactory({ token: Token.THOR });
        expect(nft.uri(1202100)).toBeDefined();
    });
    it('should return idBy(year=2021, level=0, index=0)', async () => {
        const nft = await XPowerNftMockFactory({ token: Token.THOR });
        expect(nft.idBy(2021, 0, 0) == 1202100).toBeTruthy();
    });
});
describe('XPowerPptMockFactory', () => {
    const year = new Date().getFullYear();
    it(`should fetch & validate uri(id=1${year}00)`, async () => {
        const nft = await XPowerNftMockFactory({ token: Token.THOR });
        const uri = nft.uri(nft.idBy(year, 0, 0)); // current!
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toEqual('UNIT THOR');
                expect(json.description).toEqual('Stakeable UNIT THOR NFT');
                expect(json.external_url).toEqual('https://www.xpowermine.com/nfts?token=THOR')
                expect(json.image).toMatch(new RegExp(`${year}/Thor/1-Thor_UNIT.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
    it(`should fetch & validate uri(id=2${year}03)`, async () => {
        const nft = await XPowerNftMockFactory({ token: Token.LOKI });
        const uri = nft.uri(nft.idBy(year, 3, 1)); // current!
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toEqual('KILO LOKI');
                expect(json.description).toEqual('Stakeable KILO LOKI NFT');
                expect(json.external_url).toEqual('https://www.xpowermine.com/nfts?token=LOKI')
                expect(json.image).toMatch(new RegExp(`${year}/Loki/2-Loki_KILO.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
    it(`should fetch & validate uri(id=3${year}06)`, async () => {
        const nft = await XPowerNftMockFactory({ token: Token.ODIN });
        const uri = nft.uri(nft.idBy(nft.year(), 6, 2)); // current!
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toEqual('MEGA ODIN');
                expect(json.description).toEqual('Stakeable MEGA ODIN NFT');
                expect(json.external_url).toEqual('https://www.xpowermine.com/nfts?token=ODIN')
                expect(json.image).toMatch(new RegExp(`${year}/Odin/3-Odin_MEGA.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
    it(`should fetch & validate uri(id=4${year}09)`, async () => {
        const nft = await XPowerNftMockFactory({ token: Token.HELA });
        const uri = nft.uri(nft.idBy(nft.year(), 9, 3)); // current!
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toEqual('GIGA HELA');
                expect(json.description).toEqual('Stakeable GIGA HELA NFT');
                expect(json.external_url).toEqual('https://www.xpowermine.com/nfts?token=HELA')
                expect(json.image).toMatch(new RegExp(`${year}/Hela/4-Hela_GIGA.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
});
