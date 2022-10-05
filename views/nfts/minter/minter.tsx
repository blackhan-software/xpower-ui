import { NftMinterApproval, NftMinterList, NftMinterStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    list: NftMinterList;
    approval: NftMinterApproval | null;
    onApproval?: (token: Token) => void;
    status: NftMinterStatus | null;
    onBatchMint?: (token: Token, list: NftMinterList) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
    token: Token;
}
export function UiNftMinter(
    props: Props
) {
    return <div
        className='btn-group nft-batch-minter' role='group'
    >
        {$toggleAll(props)}
        {$burnApproval(props)}
        {$batchMinter(props)}
        {$info(props)}
    </div>;
}
function $toggleAll(
    { toggled, onToggled }: Props
) {
    const title = !toggled
        ? 'Show all NFT levels'
        : 'Hide all NFT levels';
    return <button
        type='button' id='toggle-all'
        className='btn btn-outline-warning no-ellipsis'
        data-bs-placement='top' data-bs-toggle='tooltip'
        onClick={onToggled?.bind(null, !toggled)}
        title={title}
    >
        <i className={toggled
            ? 'bi-chevron-double-up'
            : 'bi-chevron-double-down'
        } />
    </button>;
}
function $burnApproval(
    { token, approval, onApproval }: Props
) {
    const is_approved = approved(approval);
    const is_approving = approving(approval);
    const text = is_approving
        ? 'Approving NFT Minting…'
        : 'Approve NFT Minting';
    return <button
        type='button' id='nft-burn-approval'
        className='btn btn-outline-warning'
        data-bs-placement='top' data-bs-toggle='tooltip'
        disabled={is_approving || is_approved || is_approved === null}
        onClick={onApproval?.bind(null, token)}
        style={{ display: !is_approved ? 'block' : 'none' }}
        title={`Approve burning of ${token}s to enable NFT minting`}
    >
        {Spinner({
            show: !!is_approving, grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
function $batchMinter(
    { approval, list, status, token, onBatchMint }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved(approval) ? 'show' : ''
    ];
    const text = minting(status)
        ? 'Minting NFTs…'
        : 'Mint NFTs';
    return <button
        type='button' id='nft-batch-minter'
        className={classes.join(' ')}
        disabled={disabled({ list, status })}
        onClick={onBatchMint?.bind(null, token, list)}
    >
        {Spinner({
            show: Boolean(minting(status)), grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
function $info(
    { token }: Props
) {
    return <button type='button'
        className='btn btn-outline-warning info'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={`(Batch) mint stakeable ${token} NFTs`}
    >
        <InfoCircle fill={true} />
    </button>;
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
        style={{ visibility: show ? 'visible' : 'hidden' }}
    />;
}
function approved(
    approval: NftMinterApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === NftMinterApproval.approved;
}
function approving(
    approval: NftMinterApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === NftMinterApproval.approving;
}
function disabled(
    { list, status }: Pick<Props, 'list' | 'status'>
) {
    if (minting(status)) {
        return true;
    }
    if (!positives(list)) {
        return true;
    }
    return false;
}
function minting(
    status: NftMinterStatus | null
): boolean | null {
    return status === NftMinterStatus.minting;
}
function positives(
    list: NftMinterList
) {
    const amounts = Object.values(list).map(
        ({ amount }) => amount
    );
    const positives = amounts.filter(
        (amount) => amount > 0n
    );
    return positives.length > 0;
}
export default UiNftMinter;
