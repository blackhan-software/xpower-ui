import { tokenReducer } from './token-reducer';
import { switchToken } from '../actions';
import { Token } from '../types';

describe('Store w/token-reducer', () => {
    it('should switch from XPOW to XPOW', () => {
        const state_0 = Token.XPOW;
        const state_1 = tokenReducer(state_0, switchToken(Token.XPOW));
        expect(state_1).toEqual(Token.XPOW);
    });
    it('should switch from XPOW to XPOW', () => {
        const state_0 = Token.XPOW;
        const state_1 = tokenReducer(state_0, switchToken(Token.XPOW));
        expect(state_1).toEqual(Token.XPOW);
    });
 });
