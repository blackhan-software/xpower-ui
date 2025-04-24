import { Button, Span } from '../../../source/react';
import { PptMinterApproval1, PptMinterApproval2 } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';
import { approved2 } from './ppt-claim-approval';

type Props = {
    approval1: PptMinterApproval1 | null;
    approval2: PptMinterApproval2 | null;
    onApproval?: () => void;
}
export function UiPptStakeApproval(
    { approval1, approval2, onApproval }: Props
) {
    const is_approved1 = approved1(approval1);
    const is_approved2 = approved2(approval2);
    const is_approving1 = approving1(approval1);
    const text = is_approving1
        ? 'Approving NFT Staking…'
        : 'Approve NFT Staking';
    return <Button id='ppt-burn-approval'
        className='btn btn-outline-warning'
        disabled={is_approving1 || is_approved1 || is_approved1 === null}
        onClick={onApproval?.bind(null)}
        style={{
            borderRight: !is_approved1 && !is_approved2 ? '1px solid' : 'none',
            width: is_approved2 ? 'calc(100% - 83px)' : 'calc(50% - 42.5px)',
            display: !is_approved1 ? 'block' : 'none',
        }}
        title={`Approve staking (and unstaking) of NFTs`}
    >
        {Spinner({
            show: !!is_approving1, grow: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
}
export function approved1(
    approval: PptMinterApproval1 | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === PptMinterApproval1.approved;
}
export function approving1(
    approval: PptMinterApproval1 | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === PptMinterApproval1.approving;
}
export default UiPptStakeApproval;
