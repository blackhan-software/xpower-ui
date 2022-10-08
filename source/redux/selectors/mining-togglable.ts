import { Mining, Token } from '../types';

export function miningTogglable(
    { speed }: Pick<Mining, 'speed'>, token: Token
) {
    return speed[token] > 0;
}
export default miningTogglable;
