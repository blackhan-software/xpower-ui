import { Action } from '@reduxjs/toolkit';
import { Years } from '../../years';
import * as actions from '../actions';
import { NftLevels, NftToken, NftTokens, PptAmounts, PptDetails, PptFlags, PptMinter, PptsUi } from '../types';

export function pptsUiReducer(
    ppts_ui: PptsUi = pptsUiState(), action: Action
): PptsUi {
    if (actions.setPptsUiAmounts.match(action)) {
        const { amounts: rhs } = action.payload;
        const { amounts: lhs } = ppts_ui;
        return {
            ...ppts_ui, amounts: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setPptsUiDetails.match(action)) {
        const { details: rhs } = action.payload;
        const { details: lhs } = ppts_ui;
        return {
            ...ppts_ui, details: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setPptsUiFlags.match(action)) {
        const { flags: rhs } = action.payload;
        const { flags: lhs } = ppts_ui;
        return {
            ...ppts_ui, flags: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setPptsUiMinter.match(action)) {
        const { minter: rhs } = action.payload;
        const { minter: lhs } = ppts_ui;
        return {
            ...ppts_ui, minter: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setPptsUiToggled.match(action)) {
        const { toggled: rhs } = action.payload;
        const { toggled: lhs } = ppts_ui;
        return {
            ...ppts_ui, toggled: rhs ?? lhs
        };
    }
    if (actions.setPptsUi.match(action)) {
        return $.extend(true, {}, ppts_ui, action.payload);
    }
    return ppts_ui;
}
export function pptsUiState() {
    return {
        amounts: pptAmounts(),
        details: pptDetails(),
        minter: pptMinter(),
        flags: pptFlags(),
        toggled: false
    };
}
export function pptWrap<WR extends Record<string, unknown>>(
    wrapped_record: WR
) {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, wrapped_record])
    );
    return entries as Record<NftToken, WR>;
}
export function pptAmounts(
    amount = 0n, max = 0n, min = 0n
) {
    const amounts = Object.fromEntries(
        Array.from(NftLevels()).map(
            (nft_level) => [nft_level, {
                amount, max, min
            }]
        )
    );
    return pptWrap(amounts as PptAmounts);
}
export function pptDetails(
    image = {
        loading: true, url_market: null, url_content: null
    },
    target = {
        valid: null, value: null
    },
    amount = {
        valid: null, value: null
    },
    claimer = {
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
                claimer,
                target,
                toggled: false,
                expanded: null,
            }])
        )])
    );
    return pptWrap(details as PptDetails);
}
export function pptMinter() {
    const minter = {
        approval: null,
        minter_status: null,
        burner_status: null,
        claimer_status: null,
    };
    return pptWrap(minter as PptMinter);
}
export function pptFlags(
    display = true, toggled = false
) {
    const flags = Object.fromEntries(
        Array.from(NftLevels()).map(
            (ppt_level) => [ppt_level, {
                display, toggled
            }]
        )
    );
    return flags as PptFlags;
}
export default pptsUiReducer;
