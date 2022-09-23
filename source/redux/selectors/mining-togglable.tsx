import { Mining } from '../types';

export function miningTogglable({ speed }: Pick<Mining, 'speed'>) {
    return speed > 0;
}
export default miningTogglable;
