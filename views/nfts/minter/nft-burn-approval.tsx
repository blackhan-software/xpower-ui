import { Button, Span } from '../../../source/react';
import { NftMinterApproval } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';

type Props = {
    approval: NftMinterApproval | null;
    onApproval?: () => void;
}
export function UiNftBurnApproval(
    { approval, onApproval }: Props
) {
    const is_approved = approved(approval);
    const is_approving = approving(approval);
    const text = is_approving
        ? 'Approving NFT Minting…'
        : 'Approve NFT Minting';
    return <Button id='nft-burn-approval'
        className='btn btn-outline-warning'
        disabled={is_approving || is_approved || is_approved === null}
        onClick={onApproval?.bind(null)}
        style={{ display: !is_approved ? 'block' : 'none' }}
        title={`Approve minting of NFTs`}
    >
        {Spinner({
            show: !!is_approving, grow: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
}
export function approved(
    approval: NftMinterApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === NftMinterApproval.approved;
}
export function approving(
    approval: NftMinterApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === NftMinterApproval.approving;
}
export default UiNftBurnApproval;
