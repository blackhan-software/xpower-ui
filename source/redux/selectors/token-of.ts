import { Tokenizer } from '../../token';
import { AppState } from '../store';

export function xtokenOf(
    { token }: Pick<AppState, 'token'>
) {
    return Tokenizer.xify(token);
}
export function atokenOf(
    { token }: Pick<AppState, 'token'>
) {
    return Tokenizer.aify(token);
}
