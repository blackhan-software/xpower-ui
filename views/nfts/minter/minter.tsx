import { NftMintApproval, NftMinterList, NftMintStatus as NftMintStatus, NftUpgradeStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    list: NftMinterList;
    approval: NftMintApproval | null;
    onApproval?: (token: Token) => void;
    mintStatus: NftMintStatus | null;
    onBatchMint?: (token: Token, list: NftMinterList) => void;
    upgradeStatus: NftUpgradeStatus | null;
    onBatchUpgrade?: (token: Token, list: NftMinterList) => void;
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
        {$batchUpgrader(props)}
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
    { approval, list, mintStatus: status, token, onBatchMint }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved(approval) ? 'show' : ''
    ];
    const text = minting(status)
        ? <>Minting<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
        : <>Mint<span className="d-none d-sm-inline">&nbsp;NFTs</span></>
    return <button
        type='button' id='nft-batch-minter'
        className={classes.join(' ')}
        disabled={disabled1({ list, status })}
        onClick={onBatchMint?.bind(null, token, list)}
    >
        {Spinner({
            show: Boolean(minting(status)), grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
function $batchUpgrader(
    { approval, list, upgradeStatus: status, token, onBatchUpgrade }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved(approval) ? 'show' : ''
    ];
    const text = upgrading(status)
        ? <>Upgrading<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
        : <>Upgrade<span className="d-none d-sm-inline">&nbsp;NFTs</span></>
    return <button
        type='button' id='nft-batch-upgrader'
        className={classes.join(' ')}
        disabled={disabled2({ list, status })}
        onClick={onBatchUpgrade?.bind(null, token, list)}
    >
        {Spinner({
            show: Boolean(upgrading(status)), grow: true
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
        title={`Batch mint or upgrade stakeable ${token} NFTs`}
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
        style={{ display: show ? 'inline-block' : 'none' }}
    />;
}
function approved(
    approval: NftMintApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === NftMintApproval.approved;
}
function approving(
    approval: NftMintApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === NftMintApproval.approving;
}
function minting(
    status: NftMintStatus | null
): boolean | null {
    return status === NftMintStatus.minting;
}
function disabled1({ list, status }: {
    list: NftMinterList, status: NftMintStatus | null
}) {
    if (minting(status)) {
        return true;
    }
    if (!positives1(list)) {
        return true;
    }
    if (!inRange1(list)) {
        return true;
    }
    return false;
}
function positives1(
    list: NftMinterList
) {
    const amounts = Object.values(list).map(
        ({ amount1 }) => amount1
    );
    const positives = amounts.filter(
        (amount) => amount > 0n
    );
    return positives.length > 0;
}
function inRange1(
    list: NftMinterList
) {
    for (const { amount1, min1 } of Object.values(list)) {
        if (amount1 < min1) {
            return false;
        }
    }
    return true;
}
function upgrading(
    status: NftUpgradeStatus | null
): boolean | null {
    return status === NftUpgradeStatus.upgrading;
}
function disabled2({ list, status }: {
    list: NftMinterList, status: NftUpgradeStatus | null
}) {
    if (upgrading(status)) {
        return true;
    }
    if (!positives2(list)) {
        return true;
    }
    if (!inRange2(list)) {
        return true;
    }
    return false;
}
function positives2(
    list: NftMinterList
) {
    const amounts = Object.values(list).map(
        ({ amount2 }) => amount2
    );
    const positives = amounts.filter(
        (amount) => amount > 0n
    );
    return positives.length > 0;
}
function inRange2(
    list: NftMinterList
) {
    for (const { amount2, min2, max2 } of Object.values(list)) {
        if (amount2 < min2 || max2 < amount2) {
            return false;
        }
    }
    return true;
}
export default UiNftMinter;
