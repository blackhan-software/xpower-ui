import { Button, Span } from '../../../source/react';
import { PptMinterApproval } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';

type Props = {
    approval: PptMinterApproval | null;
    onApproval?: () => void;
}
export function UiPptBurnApproval(
    { approval, onApproval }: Props
) {
    const is_approved = approved(approval);
    const is_approving = approving(approval);
    const text = is_approving
        ? 'Approving NFT Staking…'
        : 'Approve NFT Staking';
    return <Button id='ppt-burn-approval'
        className='btn btn-outline-warning'
        disabled={is_approving || is_approved || is_approved === null}
        onClick={onApproval?.bind(null)}
        style={{ display: !is_approved ? 'block' : 'none' }}
        title={`Approve staking (and unstaking) of NFTs`}
    >
        {Spinner({
            show: !!is_approving, grow: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
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
