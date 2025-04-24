import { Button, Span } from '../../../source/react';
import { PptMinterApproval1, PptMinterApproval2 } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';
import { approved1 } from './ppt-stake-approval';

type Props = {
    approval1: PptMinterApproval1 | null;
    approval2: PptMinterApproval2 | null;
    onApproval?: () => void;
}
export function UiPptClaimApproval(
    { approval1, approval2, onApproval }: Props
) {
    const is_approved1 = approved1(approval1);
    const is_approved2 = approved2(approval2);
    const is_approving2 = approving2(approval2);
    const text = is_approving2
        ? 'Approving APOW Claiming…'
        : 'Approve APOW Claiming';
    return <Button id='ppt-claim-approval'
        className='btn btn-outline-warning'
        disabled={is_approving2 || is_approved2 || is_approved2 === null}
        onClick={onApproval?.bind(null)}
        style={{
            width: is_approved1 ? 'calc(100% - 83px)' : 'calc(50% - 42.5px)',
            display: !is_approved2 ? 'block' : 'none',
        }}
        title={`Approve claiming (supplying plus burning) of APOWs`}
    >
        {Spinner({
            show: !!is_approving2, grow: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
}
export function approved2(
    approval: PptMinterApproval2 | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === PptMinterApproval2.approved;
}
export function approving2(
    approval: PptMinterApproval2 | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === PptMinterApproval2.approving;
}
export default UiPptClaimApproval;
