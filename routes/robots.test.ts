import request from 'supertest';
import app from '../app';

describe('GET /robots.txt', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/robots.txt');
    });
    it('should return w/an HTTP code = 200 OK', async () => {
        await get.expect(200);
    });
    it('should return w/a Content-Type ~ text/plain', async () => {
        await get.expect('Content-Type', /text\/plain/)
    });
    it('should return w/a Content-Length > 0', async () => {
        await get.expect((res) => {
            const length = BigInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
});
