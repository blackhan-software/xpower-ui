import { Token } from '../types';
import { tokenOf } from './token-of';

describe('token-of', () => {
    it('should return token', () => {
        const token = Token.THOR;
        const token_of = tokenOf({ token });
        expect(token_of).toEqual(token);
    });
});
