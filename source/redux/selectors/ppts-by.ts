import { AppState } from '../store';
import { Nft, NftFullId, NftIssue, NftLevel, Nfts, NftToken } from '../types';

export function pptsBy(
    { ppts }: Pick<AppState, 'ppts'>, nft?: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }
): Nfts {
    const issue = typeof nft === 'string'
        ? Nft.issue(nft) : nft?.issue;
    const level = typeof nft === 'string'
        ? Nft.level(nft) : nft?.level;
    const token = typeof nft === 'string'
        ? Nft.token(nft) : nft?.token;
    return {
        items: Object.fromEntries(
            Object.entries(ppts.items).filter(([id]) => {
                if (issue !== undefined && issue !== Nft.issue(id as NftFullId)) {
                    return false;
                }
                if (level !== undefined && level !== Nft.level(id as NftFullId)) {
                    return false;
                }
                if (token !== undefined && token !== Nft.token(id as NftFullId)) {
                    return false;
                }
                return true;
            })
        )
    };
}
