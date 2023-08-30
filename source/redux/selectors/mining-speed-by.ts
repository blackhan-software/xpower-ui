import { AppState } from '../store';

export function miningSpeedBy(
    { mining }: Pick<AppState, 'mining'>
) {
    return mining.speed;
}
