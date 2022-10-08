import { Mining, MinerStatus } from '../types';

export function miningSpeedable(
    { status }: Pick<Mining, 'status'>
) {
    switch (status) {
        case null:
            return false;
        case MinerStatus.starting:
        case MinerStatus.started:
        case MinerStatus.stopping:
            return false;
        default:
            return true;
    }
}
export default miningSpeedable;
