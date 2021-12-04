/* eslint @typescript-eslint/no-explicit-any: [off] */
import urlify from './urlify';

describe('urlify', () => {
    it('should urlify http://www.xpowermine.com', () => {
        const url = urlify('http://www.xpowermine.com');
        expect(url?.href).toEqual('http://www.xpowermine.com/');
    });
    it('should *not* urlify www.xpowermine.com', () => {
        const url = urlify('www.xpowermine.com');
        expect(url).toEqual(null);
    });
});
