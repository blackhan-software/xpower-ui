/* eslint @typescript-eslint/no-unused-vars: [off] */
import { AppState } from '../store';
import { Amount, Nft, NftFullId, NftIssue, NftLevel, Supply } from '../types';

export function pptTotalBy(
    { ppts }: Pick<AppState, 'ppts'>, ppt?: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
    }
): {
    amount: Amount, supply: Supply
} {
    const issue = typeof ppt === 'string'
        ? Nft.issue(ppt) : ppt?.issue;
    const level = typeof ppt === 'string'
        ? Nft.level(ppt) : ppt?.level;
    const filtered = Object.entries(ppts.items).filter(([id]) => {
        if (issue !== undefined && issue !== Nft.issue(id as NftFullId)) {
            return false;
        }
        if (level !== undefined && level !== Nft.level(id as NftFullId)) {
            return false;
        }
        return true;
    });
    const amounts = filtered.map(([_, i]) => i.amount);
    const amount = amounts.reduce((a1, a2) => a1 + a2, 0n);
    const supplies = filtered.map(([_, i]) => i.supply);
    const supply = supplies.reduce((s1, s2) => s1 + s2, 0n);
    return { amount, supply };
}
