import { AppState } from '../store';
import { Level, MintingRow } from '../types';

export function mintingRowsBy(
    { minting }: Pick<AppState, 'minting'>, row: Partial<MintingRow>
): Array<[Level, MintingRow]> {
    return Object.entries(minting.rows).filter(([_, r]) => {
        let keep = true;
        for (const k in row) {
            const key = k as keyof MintingRow;
            keep &&= row[key] === r[key];
        }
        return keep;
    }).map(([l, r]) => [Number(l), r]);
}
export default mintingRowsBy;
