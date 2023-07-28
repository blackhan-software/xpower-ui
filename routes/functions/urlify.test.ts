/* eslint @typescript-eslint/no-explicit-any: [off] */
import urlify from './urlify';

describe('urlify', () => {
    it('should urlify http://www.host.tld', () => {
        const url = urlify('http://www.host.tld');
        expect(url?.href).toEqual('http://www.host.tld/');
    });
    it('should *not* urlify www.host.tld', () => {
        const url = urlify('www.host.tld');
        expect(url).toEqual(null);
    });
});
