import { Years } from '../../years';
import { Action } from '../actions/nfts-ui-actions';
import { NftAmounts, NftDetails, NftFlags, NftLevels, NftMinter, NftsUi, NftToken, NftTokens } from '../types';

export function nftsUiReducer(
    nfts_ui: NftsUi = {
        amounts: nftWrap(nftAmounts()),
        details: nftWrap(nftDetails()),
        minter: nftWrap(nftMinter()),
        flags: nftFlags(),
        toggled: false
    },
    action: Action
): NftsUi {
    if (!action.type.startsWith('nfts-ui/set')) {
        return nfts_ui;
    }
    return $.extend(true, {}, nfts_ui, action.payload);
}
export function nftWrap<WR extends Record<string, unknown>>(
    wrapped_record: WR
) {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, wrapped_record])
    );
    return entries as Record<NftToken, WR>;
}
export function nftAmounts(
    amount = 0n, max = 0n, min = 0n
) {
    const amounts = Object.fromEntries(
        Array.from(NftLevels()).map(
            (nft_level) => [nft_level, {
                amount, max, min
            }]
        )
    );
    return amounts as NftAmounts;
}
export function nftDetails(
    image = {
        loading: true, url_market: null, url_content: null
    },
    target = {
        valid: null, value: null
    },
    amount = {
        valid: null, value: null
    },
    sender = {
        status: null
    }
) {
    const issues = Array.from(Years()).reverse();
    const levels = Array.from(NftLevels());
    const details = Object.fromEntries(
        levels.map((level) => [level, Object.fromEntries(
            issues.map((issue) => [issue, {
                amount,
                fixed: issues[0] - issue ? false : true,
                image,
                sender,
                target,
                toggled: false,
                expanded: null,
            }])
        )])
    );
    return details as NftDetails;
}
export function nftMinter() {
    const minter = {
        approval: null, status: null
    };
    return minter as NftMinter;
}
export function nftFlags(
    display = true, toggled = false
) {
    const flags = Object.fromEntries(
        Array.from(NftLevels()).map(
            (nft_level) => [nft_level, {
                display, toggled
            }]
        )
    );
    return flags as NftFlags;
}
export default nftsUiReducer;
