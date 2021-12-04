import request from 'supertest';
import app from '../app';

describe('GET /migrate', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get('/migrate');
    });
    it('should return w/an HTTP code = 404 Not Found', async () => {
        await get.expect(404);
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
