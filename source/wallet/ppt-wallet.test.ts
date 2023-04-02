import { ipfs_gateway } from '../../test/env-ipfs-gateway';
import { Token } from '../redux/types';
import { PptWalletMock } from './ppt-wallet';

import request from 'supertest';

describe('PptWalletMock', () => {
    it('should return totalSupply(id=1202100) = 0', async () => {
        const nft = new PptWalletMock(0n, Token.THOR);
        const supply = await nft.totalSupply('1202100');
        expect(supply === 0n).toBeTruthy();
    });
    it('should return year() >= 2021', async () => {
        const nft = new PptWalletMock(0n, Token.THOR);
        const year = await nft.year();
        expect(year >= 2021).toBeTruthy();
    });
    it('should return uri(id=1202100)', async () => {
        const nft = new PptWalletMock(0n, Token.THOR);
        const uri = await nft.uri('1202100');
        expect(uri).toBeDefined();
    });
    it('should return idBy(year=2021, level=0)', async () => {
        const nft = new PptWalletMock(0n, Token.THOR);
        const id = await nft.idBy(2021, 0);
        expect(id === '1202100').toBeTruthy();
    });
});
describe('PptWalletMock', () => {
    const year = new Date().getFullYear();
    it(`should fetch & validate uri(id=1${year}00)`, async () => {
        const nft = new PptWalletMock(0n, Token.THOR);
        const uri = await nft.uri(nft.idBy(year, 0));
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toEqual('UNIT THOR');
                expect(json.description).toEqual('Staked UNIT THOR NFT');
                expect(json.external_url).toEqual('https://www.xpowermine.com/staking?token=THOR')
                expect(json.image).toMatch(new RegExp(`${year}/Thor/1-Thor_UNIT.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
    it(`should fetch & validate uri(id=2${year}03)`, async () => {
        const nft = new PptWalletMock(0n, Token.LOKI);
        const uri = await nft.uri(nft.idBy(year, 3));
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toEqual('KILO LOKI');
                expect(json.description).toEqual('Staked KILO LOKI NFT');
                expect(json.external_url).toEqual('https://www.xpowermine.com/staking?token=LOKI')
                expect(json.image).toMatch(new RegExp(`${year}/Loki/2-Loki_KILO.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
    it(`should fetch & validate uri(id=3${year}06)`, async () => {
        const nft = new PptWalletMock(0n, Token.ODIN);
        const uri = await nft.uri(nft.idBy(year, 6));
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toEqual('MEGA ODIN');
                expect(json.description).toEqual('Staked MEGA ODIN NFT');
                expect(json.external_url).toEqual('https://www.xpowermine.com/staking?token=ODIN')
                expect(json.image).toMatch(new RegExp(`${year}/Odin/3-Odin_MEGA.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
    it(`should fetch & validate uri(id=4${year}09)`, async () => {
        const nft = new PptWalletMock(0n, Token.HELA);
        const uri = await nft.uri(nft.idBy(year, 9));
        expect(uri).toBeDefined();
        const gateway = ipfs_gateway();
        expect(gateway).toBeDefined();
        await request(gateway).get(uri)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(({ body: json }) => {
                expect(json.name).toEqual('GIGA HELA');
                expect(json.description).toEqual('Staked GIGA HELA NFT');
                expect(json.external_url).toEqual('https://www.xpowermine.com/staking?token=HELA')
                expect(json.image).toMatch(new RegExp(`${year}/Hela/4-Hela_GIGA.png$`))
                expect(json.attributes).toBeDefined();
            });
    });
});
