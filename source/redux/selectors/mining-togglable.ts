import { Mining } from '../types';

export function miningTogglable(
    { speed }: Pick<Mining, 'speed'>
) {
    return speed !== null && speed > 0;
}
export default miningTogglable;
