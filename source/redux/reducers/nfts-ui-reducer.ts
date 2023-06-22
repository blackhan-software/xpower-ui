import { Action } from '@reduxjs/toolkit';
import { RWParams } from '../../params';
import { Years } from '../../years';
import * as actions from '../actions';
import { NftAmounts, NftDetails, NftFlags, NftLevels, NftMinter, NftToken, NftTokens, NftsUi } from '../types';

export function nftsUiReducer(
    nfts_ui: NftsUi = nftsUiState(), action: Action
): NftsUi {
    if (actions.setNftsUiAmounts.match(action)) {
        const { amounts: rhs } = action.payload;
        const { amounts: lhs } = nfts_ui;
        return {
            ...nfts_ui, amounts: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setNftsUiDetails.match(action)) {
        const { details: rhs } = action.payload;
        const { details: lhs } = nfts_ui;
        return {
            ...nfts_ui, details: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setNftsUiFlags.match(action)) {
        const { flags: rhs } = action.payload;
        const { flags: lhs } = nfts_ui;
        return {
            ...nfts_ui, flags: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setNftsUiMinter.match(action)) {
        const { minter: rhs } = action.payload;
        const { minter: lhs } = nfts_ui;
        return {
            ...nfts_ui, minter: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setNftsUiToggled.match(action)) {
        const { toggled: rhs } = action.payload;
        const { toggled: lhs } = nfts_ui;
        return {
            ...nfts_ui, toggled: rhs ?? lhs
        };
    }
    if (actions.setNftsUi.match(action)) {
        return $.extend(true, {}, nfts_ui, action.payload);
    }
    return nfts_ui;
}
export function nftsUiState() {
    return {
        amounts: nftAmounts(),
        details: nftDetails(),
        minter: nftMinter(),
        flags: nftFlags(),
        toggled: false
    };
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
    amount1 = 0n, max1 = 0n, min1 = 0n
) {
    const amounts = Object.fromEntries(
        Array.from(NftLevels()).map(
            (nft_level) => [nft_level, {
                amount1, max1, min1
            }]
        )
    );
    return nftWrap(amounts as NftAmounts);
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
    return nftWrap(details as NftDetails);
}
export function nftMinter() {
    const minter = {
        approval: null,
        minter_status: null,
        burner_status: null,
        upgrader_status: null,
    };
    return nftWrap(minter as NftMinter);
}
export function nftFlags(
    display = true
) {
    const flags = Object.fromEntries(
        Array.from(NftLevels()).map((l) => [l, {
            display, toggled: RWParams.nftLevels.includes(l)
        }])
    );
    return flags as NftFlags;
}
export default nftsUiReducer;
