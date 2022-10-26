import { Token } from '../types';
import { xtokenOf } from './token-of';
import { atokenOf } from './token-of';

describe('xtoken-of', () => {
    it('should return xtoken', () => {
        const token_of = xtokenOf({ token: Token.aTHOR });
        expect(token_of).toEqual(Token.THOR);
    });
});
describe('atoken-of', () => {
    it('should return atoken', () => {
        const token_of = atokenOf({ token: Token.THOR });
        expect(token_of).toEqual(Token.aTHOR);
    });
});
