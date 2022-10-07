import { AppState } from '../store';
import { Token } from '../types';

export function tokenOf(
    { token }: Pick<AppState, 'token'>
): Token {
    return token;
}
export default tokenOf;
