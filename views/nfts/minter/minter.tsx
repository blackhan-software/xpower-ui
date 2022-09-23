import { App } from '../../../source/app';
import { Token } from '../../../source/redux/types';
import { NftMinterList } from '../../../source/redux/types';
import { NftMinterApproval } from '../../../source/redux/types';
import { NftMinterStatus } from '../../../source/redux/types';

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
            onClick={() => this.toggleAll(toggled)}
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
            ? 'Show all NFT levels'
            : 'Hide all NFT levels';
    }
    toggleAll(
        toggled: boolean
    ) {
        const { onToggled } = this.props;
        if (onToggled) onToggled(!toggled);
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
