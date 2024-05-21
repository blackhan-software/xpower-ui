import request from 'supertest';
import app from '../app';

describe('GET /', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/');
    });
    it('should return w/an HTTP code = 302 Found', async () => {
        await get.expect(302);
    });
});
describe('GET /*/manifest.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/mine/manifest.json');
    });
    it('should return w/an HTTP code = 302 Found', async () => {
        await get.expect(302);
    });
});
describe('GET /mine', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/mine');
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
describe('GET /stake', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/stake');
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
describe('GET /swap', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/swap');
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
describe('GET /about', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/about');
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
