/* eslint @typescript-eslint/no-explicit-any: [off] */
import host from './host';

describe('host', () => {
    it('should return host of request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(host(req as any)).toEqual('http://localhost:3000');
    });
});
