import request from 'supertest';
import app from '../app';

describe('GET /ipfs', () => {
    let get: request.Test;
    beforeEach(() => {
        const path = '/ipfs/QmX8CeKcBJAJcdynAeU1Ln74UXWG6RpakqWfbZSSLYppQA';
        get = request(app).get(path);
    })
    it('should return w/an HTTP code = 302 OK', async () => {
        await get.expect(302);
    });
    it('should redirect to IPFS gateway', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /^https:\/\/dweb.link/
            );
        });
    });
    it('should redirect with path', async () => {
        await get.expect((res) => {
            expect(res.header.location).toMatch(
                /\/ipfs\/QmX8CeKcBJAJcdynAeU1Ln74UXWG6RpakqWfbZSSLYppQA$/
            );
        });
    });
});
