import request from 'supertest';
import app from '../app';

describe('GET /nfts', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/nfts');
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ html', async () => {
        await get.expect('Content-Type', /html/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
});
describe('GET /nfts/.migrate', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/nfts/.migrate');
    });
    it('should return w/an HTTP code = 500 OK', async () => {
        await get.expect(500);
    });
    it('should return w/a Content-Type ~ html', async () => {
        await get.expect('Content-Type', /html/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
});
describe('GET /nfts/cpu/(0*)222200.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/cpu/222200.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'XPOW.CPU UNIT'
            );
            expect(describe).toBe(
                'stakeable XPOW.CPU UNIT NFT bond'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2222/xpow.cpu-unit.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/cpu/(0*)333300.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/cpu/333300.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
describe('GET /nfts/gpu/(0*)202203.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/gpu/00000000000000000000000000202203.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'XPOW.GPU KILO'
            );
            expect(describe).toBe(
                'stakeable XPOW.GPU KILO NFT bond'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2022/xpow.gpu-kilo.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/gpu/(0*)333303.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/gpu/333303.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
describe('GET /nfts/asic/(0*)202306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/asic/0000000000000000000000000000000000000000000000000000000000202306.json'
        );
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ json', async () => {
        await get.expect('Content-Type', /json/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
    it('should return metadata', async () => {
        await get.expect((res) => {
            const { name, describe, image } = res.body;
            expect(name).toEqual(
                'XPOW.ASIC MEGA'
            );
            expect(describe).toBe(
                'stakeable XPOW.ASIC MEGA NFT bond'
            );
            expect(image).toMatch(
                new RegExp('^http://127.0.0.1:')
            );
            expect(image).toMatch(
                new RegExp('/images/nft/2023/xpow.asic-mega.png$')
            );
        });
    });
});
describe('REDIRECT /nfts/asic/(0*)333306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/asic/333306.json'
        );
    });
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^\/ipfs\/QmTvy3Vfnj4UNL5dpxDcA5fLLQpwzA2LMScsEpgsbYikLg$/
            );
        });
    });
});
