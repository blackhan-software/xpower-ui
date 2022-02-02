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
                'Stakeable XPOW.CPU UNIT NFT'
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
describe('GET /nfts/cpu/(0*)363f8.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/cpu/363f8.json'
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
                'Stakeable XPOW.CPU UNIT NFT'
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
describe('REDIRECT /nfts/cpu/(0*)515f4.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/cpu/515f4.json'
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
                'Stakeable XPOW.GPU KILO NFT'
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
describe('GET /nfts/gpu/(0*)315db.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/gpu/00000000000000000000000000315db.json'
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
                'Stakeable XPOW.GPU KILO NFT'
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
describe('REDIRECT /nfts/gpu/(0*)515f7.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/gpu/515f7.json'
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
                'Stakeable XPOW.ASIC MEGA NFT'
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
describe('GET /nfts/asic/(0*)31642.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/asic/000000000000000000000000000000000000000000000000000000000031642.json'
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
                'Stakeable XPOW.ASIC MEGA NFT'
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
describe('REDIRECT /nfts/asic/(0*)515fa.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/nfts/asic/515fa.json'
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
