import { PptMinterApproval, Token } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';

type Props = {
    approval: PptMinterApproval | null;
    onApproval?: (token: Token) => void;
    token: Token;
}
export function UiPptBurnApproval(
    { token, approval, onApproval }: Props
) {
    const is_approved = approved(approval);
    const is_approving = approving(approval);
    const text = is_approving
        ? 'Approving NFT Staking…'
        : 'Approve NFT Staking';
    return <button
        type='button' id='ppt-burn-approval'
        className='btn btn-outline-warning'
        data-bs-placement='top' data-bs-toggle='tooltip'
        disabled={is_approving || is_approved || is_approved === null}
        onClick={onApproval?.bind(null, token)}
        style={{ display: !is_approved ? 'block' : 'none' }}
        title={`Approve staking (and unstaking) of NFTs`}
    >
        {Spinner({
            show: !!is_approving, grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
export function approved(
    approval: PptMinterApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === PptMinterApproval.approved;
}
export function approving(
    approval: PptMinterApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === PptMinterApproval.approving;
}
export default UiPptBurnApproval;
