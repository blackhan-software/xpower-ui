import { AppState } from '../store';
import { Nft, NftFullId, NftIssue, NftLevel, Nfts } from '../types';

export function nftsBy(
    { nfts }: Pick<AppState, 'nfts'>, nft?: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
    }
): Nfts {
    const issue = typeof nft === 'string'
        ? Nft.issue(nft) : nft?.issue;
    const level = typeof nft === 'string'
        ? Nft.level(nft) : nft?.level;
    return {
        items: Object.fromEntries(
            Object.entries(nfts.items).filter(([id]) => {
                if (issue !== undefined && issue !== Nft.issue(id as NftFullId)) {
                    return false;
                }
                if (level !== undefined && level !== Nft.level(id as NftFullId)) {
                    return false;
                }
                return true;
            })
        )
    };
}
