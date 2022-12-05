import { Tokenizer } from '../../token';
import { AppState } from '../store';
import { Token } from '../types';

export function miningSpeedBy(
    { mining }: Pick<AppState, 'mining'>, token: Token
) {
    return mining.speed[Tokenizer.xify(token)];
}
