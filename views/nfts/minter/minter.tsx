import { NftBurnerStatus, NftMinterApproval, NftMinterList, NftMinterStatus, NftUpgraderStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { UiNftBatchBurner } from './nft-batch-burner';
import { UiNftBatchMinter } from './nft-batch-minter';
import { UiNftBatchUpgrader } from './nft-batch-upgrader';
import { UiNftBurnApproval, approved } from './nft-burn-approval';

type Props = {
    minter_list: NftMinterList;
    approval: NftMinterApproval | null;
    onApproval?: (token: Token) => void;
    minter_status: NftMinterStatus | null;
    onBatchMint?: (token: Token, list: NftMinterList) => void;
    burner_status: NftBurnerStatus | null;
    onBatchBurn?: (token: Token, list: NftMinterList) => void;
    upgrader_status: NftUpgraderStatus | null;
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
        {$batchReminter(props)}
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
    { approval, onApproval, token }: Props
) {
    return <UiNftBurnApproval
        approval={approval}
        onApproval={onApproval}
        token={token}
    />;
}
function $batchReminter(
    props: Props
) {
    const negatives = Object.values(props.minter_list)
        .map(({ amount1 }) => amount1).filter((a) => a < 0n);
    if (negatives.length === 0) {
        return $batchMinter(props)
    } else {
        return $batchBurner(props)
    }
}
function $batchMinter(
    { approval, minter_list, minter_status, onBatchMint, token }: Props
) {
    return <UiNftBatchMinter
        approved={approved(approval)}
        list={minter_list}
        onBatchMint={onBatchMint}
        status={minter_status}
        token={token}
    />;
}
function $batchBurner(
    { approval, minter_list, burner_status, token, onBatchBurn }: Props
) {
    return <UiNftBatchBurner
        approved={approved(approval)}
        list={minter_list}
        onBatchBurn={onBatchBurn}
        status={burner_status}
        token={token}
    />;
}
function $batchUpgrader(
    { approval, minter_list, onBatchUpgrade, token, upgrader_status }: Props
) {
    return <UiNftBatchUpgrader
        approved={approved(approval)}
        list={minter_list}
        onBatchUpgrade={onBatchUpgrade}
        status={upgrader_status}
        token={token}
    />;
}
function $info(
    { token }: Props
) {
    return <button type='button'
        className='btn btn-outline-warning info'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={`Batch mint, burn or upgrade stakeable ${token} NFTs`}
    >
        <InfoCircle fill={true} />
    </button>;
}
export default UiNftMinter;
