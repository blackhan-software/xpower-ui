import { NftFullId, NftIssue, NftToken, NftLevel } from '../types';
import { Amount, Supply } from '../types';

export type SetNft = {
    type: 'nft/set', payload: {
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item: {
            amount: Amount,
            supply: Supply
        }
    }
};
export const setNft = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item: {
        amount: Amount,
        supply: Supply
    }
): SetNft => ({
    type: 'nft/set', payload: {
        nft, item
    }
});
export type AddNft = {
    type: 'nft/add', payload: {
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const addNft = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item?: {
        amount: Amount, // new-amount = old-amount + amount
        supply?: Supply // new-supply = supply ?? old-supply + amount
    }
): AddNft => ({
    type: 'nft/add', payload: {
        nft, item
    }
});
export type RemoveNft = {
    type: 'nft/remove', payload: {
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const removeNft = (
    nft: NftFullId | {
        token: NftToken,
        issue: NftIssue,
        level: NftLevel,
    },
    item?: {
        amount: Amount, // new-amount = old-amount - amount
        supply?: Supply // new-supply = supply ?? old-supply (*no* decrease!)
    }
): RemoveNft => ({
    type: 'nft/remove', payload: {
        nft, item
    }
});
export type Action = SetNft | AddNft | RemoveNft;
