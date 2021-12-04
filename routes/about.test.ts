import request from 'supertest';
import app from '../app';

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
            const length = parseInt(res.headers['content-length']);
            expect(length).toBeGreaterThan(0);
        });
    });
});
