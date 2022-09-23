import { Years } from '../../years';
import { Action } from '../actions/ppts-ui-actions';
import { NftLevels, NftToken, NftTokens, PptAmounts, PptDetails, PptFlags, PptMinter, PptsUi } from '../types';

export function pptsUiReducer(
    ppts_ui: PptsUi = {
        amounts: pptWrap(pptAmounts()),
        details: pptWrap(pptDetails()),
        minter: pptWrap(pptMinter()),
        flags: pptFlags(),
        toggled: false
    },
    action: Action
): PptsUi {
    if (!action.type.startsWith('ppts-ui/set')) {
        return ppts_ui;
    }
    return $.extend(true, {}, ppts_ui, action.payload);
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
    return amounts as PptAmounts;
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
            }])
        )])
    );
    return details as PptDetails;
}
export function pptMinter() {
    const minter = {
        approval: null, minter_status: null, burner_status: null
    };
    return minter as PptMinter;
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
