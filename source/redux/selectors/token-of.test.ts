import { Token } from '../types';
import { xtokenOf } from './token-of';
import { atokenOf } from './token-of';

describe('xtoken-of', () => {
    it('should return xtoken', () => {
        const token_of = xtokenOf({ token: Token.APOW });
        expect(token_of).toEqual(Token.XPOW);
    });
});
describe('atoken-of', () => {
    it('should return atoken', () => {
        const token_of = atokenOf({ token: Token.XPOW });
        expect(token_of).toEqual(Token.APOW);
    });
});
