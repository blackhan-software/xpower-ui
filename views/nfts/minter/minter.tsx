import { Button, Div } from '../../../source/react';
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
    onApproval?: () => void;
    minter_status: NftMinterStatus | null;
    onBatchMint?: (list: NftMinterList) => void;
    burner_status: NftBurnerStatus | null;
    onBatchBurn?: (list: NftMinterList) => void;
    upgrader_status: NftUpgraderStatus | null;
    onBatchUpgrade?: (list: NftMinterList) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export function UiNftMinter(
    props: Props
) {
    return <Div
        className='btn-group nft-batch-minter' role='group'
    >
        {$toggleAll(props)}
        {$burnApproval(props)}
        {$batchReminter(props)}
        {$batchUpgrader(props)}
        {$info()}
    </Div>;
}
function $toggleAll(
    { toggled, onToggled }: Props
) {
    const title = !toggled
        ? 'Show all NFT levels'
        : 'Hide all NFT levels';
    return <Button id='toggle-all'
        className='btn btn-outline-warning no-ellipsis'
        onClick={onToggled?.bind(null, !toggled)}
        title={title}
    >
        <i className={toggled
            ? 'bi-chevron-double-up'
            : 'bi-chevron-double-down'
        } />
    </Button>;
}
function $burnApproval(
    { approval, onApproval }: Props
) {
    return <UiNftBurnApproval
        approval={approval}
        onApproval={onApproval}
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
    { approval, minter_list, minter_status, onBatchMint }: Props
) {
    return <UiNftBatchMinter
        approved={approved(approval)}
        list={minter_list}
        onBatchMint={onBatchMint}
        status={minter_status}
    />;
}
function $batchBurner(
    { approval, minter_list, burner_status, onBatchBurn }: Props
) {
    return <UiNftBatchBurner
        approved={approved(approval)}
        list={minter_list}
        onBatchBurn={onBatchBurn}
        status={burner_status}
    />;
}
function $batchUpgrader(
    { approval, minter_list, onBatchUpgrade, upgrader_status }: Props
) {
    return <UiNftBatchUpgrader
        approved={approved(approval)}
        list={minter_list}
        onBatchUpgrade={onBatchUpgrade}
        status={upgrader_status}
    />;
}
function $info() {
    return <Button className='btn btn-outline-warning info' title={
        `Mint, burn or upgrade ${Token.XPOW} NFTs`
    }>
        <InfoCircle fill={true} />
    </Button>;
}
export default UiNftMinter;
