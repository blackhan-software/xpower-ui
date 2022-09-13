import { App } from '../../../source/app';
import { Amount, Token } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';

import { UiPptBatchMinter, PptMinterStatus } from './ppt-batch-minter';
export { UiPptBatchMinter, PptMinterStatus };
import { UiPptBatchBurner, PptBurnerStatus } from './ppt-batch-burner';
export { UiPptBatchBurner, PptBurnerStatus };

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    approval: PptMinterApproval | null;
    onApproval?: (token: Token) => void;
    burner_status: PptBurnerStatus | null;
    onBatchBurn?: (token: Token, list: PptMinterList) => void;
    minter_status: PptMinterStatus | null;
    onBatchMint?: (token: Token, list: PptMinterList) => void;
    list: PptMinterList;
    onList?: (list: Partial<PptMinterList>) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean, ctrlKey: boolean) => void;
    token: Token;
}
export type PptMinterList = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
    display: boolean; toggled: boolean;
}>
export type PptMinter = {
    approval: PptMinterApproval | null;
    minter_status: PptMinterStatus | null;
    burner_status: PptBurnerStatus | null;
}
export function ppt_minter() {
    return { approval: null, minter_status: null, burner_status: null };
}
export enum PptMinterApproval {
    approving = 'approving',
    approved = 'approved',
    error = 'error'
}
function approved(
    approval: PptMinterApproval | null
): boolean {
    return approval === PptMinterApproval.approved;
}
function approving(
    approval: PptMinterApproval | null
): boolean {
    return approval === PptMinterApproval.approving;
}
export class UiPptMinter extends React.Component<
    Props
> {
    render() {
        const { minter_status, burner_status } = this.props;
        const { approval, list, toggled, token } = this.props;
        return <div
            className='btn-group ppt-batch-minter' role='group'
        >
            {this.$toggleAll(toggled)}
            {this.$burnApproval(
                token, approved(approval), approving(approval)
            )}
            {this.$pptBatchMinter(
                token, list, approved(approval), minter_status
            )}
            {this.$pptBatchBurner(
                token, list, approved(approval), burner_status
            )}
            {this.$info(token)}
        </div>;
    }
    $toggleAll(
        toggled: boolean
    ) {
        return <button type='button' id='toggle-all'
            className='btn btn-outline-warning no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            onClick={() => this.toggleAll(toggled, true)}
            title={this.title(toggled)}
        >
            <i className={toggled
                ? 'bi-chevron-double-up'
                : 'bi-chevron-double-down'
            } />
        </button>;
    }
    title(
        toggled: boolean
    ) {
        return !toggled
            ? 'Show all levels'
            : 'Hide all levels';
    }
    toggleAll(
        toggled: boolean, ctrlKey: boolean
    ) {
        const nft_levels = Array.from(NftLevels());
        const entries = nft_levels.map((nft_level): [
            NftLevel, Partial<PptMinterList[NftLevel]>
        ] => ([
            nft_level, { display: !toggled }
        ]));
        const { onList } = this.props;
        if (onList) onList(
            Object.fromEntries(entries)
        );
        const { onToggled } = this.props;
        if (onToggled) onToggled(!toggled, ctrlKey);
    }
    $burnApproval(
        token: Token,
        approved: boolean | null,
        approving: boolean | null
    ) {
        const text = approving
            ? 'Approving NFT Staking…'
            : 'Approve NFT Staking';
        return <button type='button' id='ppt-burn-approval'
            className='btn btn-outline-warning'
            data-bs-placement='top' data-bs-toggle='tooltip'
            disabled={approving || approved || approved === null}
            onClick={this.props.onApproval?.bind(this, token)}
            style={{ display: !approved ? 'block' : 'none' }}
            title={`Approve staking (and unstaking) of NFTs`}
        >
            {Spinner({
                show: !!approving, grow: true
            })}
            <span className='text'>{text}</span>
        </button>;
    }
    $pptBatchMinter(
        token: Token, list: PptMinterList,
        approved: boolean | null, status: PptMinterStatus | null
    ) {
        return <UiPptBatchMinter
            approved={approved} list={list} token={token} status={status}
            onBatchMint={this.props.onBatchMint?.bind(this, token, list)}
        />;
    }
    $pptBatchBurner(
        token: Token, list: PptMinterList,
        approved: boolean | null, status: PptBurnerStatus | null
    ) {
        return <UiPptBatchBurner
            approved={approved} list={list} token={token} status={status}
            onBatchBurn={this.props.onBatchBurn?.bind(this, token, list)}
        />;
    }
    $info(
        token: Token
    ) {
        return <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`(Batch) stake or unstake ${token} NFTs`}
        >
            <InfoCircle fill={true} />
        </button>;
    }
    componentDidUpdate() {
        App.event.emit('refresh-tips');
    }
}
export function Spinner(
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
export default UiPptMinter;
