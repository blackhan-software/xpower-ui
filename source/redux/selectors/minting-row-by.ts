import { AppState } from '../store';
import { Level } from '../types';

export function mintingRowBy(
    { minting }: Pick<AppState, 'minting'>, level: Level
) {
    return minting.rows[level];
}
export default mintingRowBy;
