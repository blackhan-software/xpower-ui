import { App } from '../../../source/app';
import { Amount, Token } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    approval: NftMinterApproval | null;
    onApproval?: (token: Token) => void;
    status: NftMinterStatus | null;
    onBatchMint?: (token: Token, list: NftMinterList) => void;
    list: NftMinterList;
    onList?: (list: Partial<NftMinterList>) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean, ctrl_key: boolean) => void;
    token: Token;
}
export type NftMinterList = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
    display: boolean; toggled: boolean;
}>
export type NftMinter = {
    approval: NftMinterApproval | null;
    status: NftMinterStatus | null;
}
export function nft_minter() {
    return { approval: null, status: null };
}
export enum NftMinterApproval {
    approving = 'approving',
    approved = 'approved',
    error = 'error'
}
function approved(
    approval: NftMinterApproval | null
): boolean {
    return approval === NftMinterApproval.approved;
}
function approving(
    approval: NftMinterApproval | null
): boolean {
    return approval === NftMinterApproval.approving;
}
export enum NftMinterStatus {
    minting = 'minting',
    minted = 'minted',
    error = 'error'
}
function minting(
    status: NftMinterStatus | null
): boolean | null {
    return status === NftMinterStatus.minting;
}
export class UiNftMinter extends React.Component<
    Props
> {
    render() {
        const { status } = this.props;
        const { approval, list, toggled, token } = this.props;
        return <div
            className='btn-group nft-batch-minter' role='group'
        >
            {this.$toggleAll(toggled)}
            {this.$burnApproval(
                token, approved(approval), approving(approval)
            )}
            {this.$batchMinter(
                token, list, approved(approval), status
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
        toggled: boolean, ctrl_key: boolean
    ) {
        const nft_levels = Array.from(NftLevels());
        const entries = nft_levels.map((nft_level): [
            NftLevel, Partial<NftMinterList[NftLevel]>
        ] => ([
            nft_level, { display: !toggled }
        ]));
        const { onList } = this.props;
        if (onList) onList(
            Object.fromEntries(entries)
        );
        const { onToggled } = this.props;
        if (onToggled) onToggled(!toggled, ctrl_key);
    }
    $burnApproval(
        token: Token,
        approved: boolean | null,
        approving: boolean | null
    ) {
        const text = approving
            ? 'Approving NFT Minting…'
            : 'Approve NFT Minting';
        return <button type='button' id='nft-burn-approval'
            className='btn btn-outline-warning'
            data-bs-placement='top' data-bs-toggle='tooltip'
            disabled={approving || approved || approved === null}
            onClick={this.props.onApproval?.bind(this, token)}
            style={{ display: !approved ? 'block' : 'none' }}
            title={`Approve burning of ${token}s to enable NFT minting`}
        >
            {Spinner({
                show: !!approving, grow: true
            })}
            <span className='text'>{text}</span>
        </button>;
    }
    $batchMinter(
        token: Token, list: NftMinterList,
        approved: boolean | null, status: NftMinterStatus | null
    ) {
        const classes = [
            'btn btn-outline-warning',
            approved ? 'show' : ''
        ];
        const text = minting(status)
            ? 'Minting NFTs…'
            : 'Mint NFTs';
        return <button type='button' id='nft-batch-minter'
            className={classes.join(' ')} disabled={this.disabled}
            onClick={this.props.onBatchMint?.bind(this, token, list)}
        >
            {Spinner({
                show: !!minting(status), grow: true
            })}
            <span className='text'>{text}</span>
        </button>;
    }
    get disabled() {
        const { status } = this.props;
        if (minting(status)) {
            return true;
        }
        const { list } = this.props;
        if (!positives(list)) {
            return true;
        }
        return false;
    }
    $info(
        token: Token
    ) {
        return <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`(Batch) mint stakeable ${token} NFTs`}
        >
            <InfoCircle fill={true} />
        </button>;
    }
    componentDidUpdate() {
        App.event.emit('refresh-tips');
    }
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
