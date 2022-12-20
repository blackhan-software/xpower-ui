import request from 'supertest';
import app from '../app';

describe('GET /ppts/thor/(0*)222200.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/thor/222200.json'
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
});
describe('GET /ppts/loki/(0*)202203.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/loki/00000000000000000000000000202203.json'
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
});
describe('GET /ppts/odin/(0*)202306.json', () => {
    let get: request.Test;
    beforeEach(() => {
        get = request(app).get(
            '/ppts/odin/0000000000000000000000000000000000000000000000000000000000202306.json'
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
});
