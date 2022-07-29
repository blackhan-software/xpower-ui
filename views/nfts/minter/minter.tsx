/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { Alerts, Alert, alert } from '../../../source/functions';
import { buffered, Referable } from '../../../source/functions';
import { Amount, Token } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { MoeWallet, NftWallet } from '../../../source/wallet';
import { OnApproval, OnTransferBatch } from '../../../source/wallet';
import { Tooltip } from '../../tooltips';

export const MAX_UINT256 = 2n ** 256n - 1n;
export const MID_UINT256 = 2n ** 255n - 1n;

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
    list: List;
    onList: (list: Partial<List>) => void;
}
type List = Record<NftLevel, {
    amount: Amount;
    max: Amount;
    min: Amount;
    display: boolean;
    toggled: boolean;
}>
type State = {
    approval: Approval | null;
    status: Status | null;
    toggled: boolean;
}
enum Approval {
    approving = 'approving',
    approved = 'approved',
    error = 'error',
    idle = 'idle',
}
function approved(
    approval: Approval | null
): boolean {
    return approval === Approval.approved;
}
function approving(
    approval: Approval | null
): boolean {
    return approval === Approval.approving;
}
enum Status {
    idle = 'idle',
    minting = 'minting',
    minted = 'minted',
    error = 'error'
}
function minting(
    status: Status | null
): boolean | null {
    return status && status === Status.minting;
}
export class NftMinter extends Referable(React.Component)<
    Props, State
> {
    constructor(props: {
        token: Token, list: List,
        onList: (list: Partial<List>) => void
    }) {
        super(props);
        this.state = {
            approval: null,
            status: null,
            toggled: false
        };
        this.events();
    }
    events() {
        Blockchain.onConnect(async/*set-approval*/({
            address, token
        }) => {
            const moe_wallet = new MoeWallet(address, token);
            const nft_wallet = new NftWallet(address, token);
            const nft_contract = await nft_wallet.contract;
            const allowance = await moe_wallet.allowance(
                address, nft_contract.address
            );
            if (allowance > MID_UINT256) {
                this.setState({ approval: Approval.approved });
            } else {
                this.setState({ approval: null });
            }
        });
        Blockchain.onceConnect(async/*set-status*/() => {
            this.setState({ status: Status.idle });
        });
    }
    render() {
        const { token, list } = this.props;
        const { approval, toggled } = this.state;
        return <div
            className='btn-group nft-batch-minter'
            ref={this.ref('nft-batch-minter')}
            role='group'
        >
            {this.$toggleAll(toggled)}
            {this.$burnApproval(
                token, approved(approval), approving(approval)
            )}
            {this.$batchMinter(
                list, approved(approval)
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
            data-state={toggled ? 'off' : 'on'}
            onClick={this.toggleAll.bind(this, toggled)}
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
            : 'Hide higher NFT levels';
    }
    toggleAll(
        toggled: boolean
    ) {
        const nft_levels = Array.from(NftLevels());
        const entries = nft_levels.map((nft_level): [
            NftLevel, Partial<List[NftLevel]>
        ] => ([
            nft_level, { display: !toggled }
        ]));
        this.props.onList(Object.fromEntries(
            entries
        ));
        this.setState({
            toggled: !toggled
        });
    }
    $burnApproval(
        token: Token,
        approved: boolean | null,
        approving: boolean | null
    ) {
        const text = approving
            ? 'Approving NFT Minting…'
            : 'Approve NFT Minting';
        return <button type='button' id='burn-approval'
            className='btn btn-outline-warning'
            data-bs-placement='top' data-bs-toggle='tooltip'
            disabled={approving || approved || approved === null}
            onClick={this.approve.bind(this, token)}
            style={{ display: !approved ? 'block' : 'none' }}
            title={`Approve burning of ${token}s to enable NFT minting`}
        >
            {Spinner({
                show: !!approving, grow: true
            })}
            <span className='text'>{text}</span>
        </button>;
    }
    async approve(
        token: Token
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const moe_wallet = new MoeWallet(address, token);
        const nft_wallet = new NftWallet(address, token);
        const nft_contract = await nft_wallet.contract;
        const old_allowance = await moe_wallet.allowance(
            address, nft_contract.address
        );
        const on_approval: OnApproval = (
            owner, spender, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            this.setState({
                approval: Approval.approved
            });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.setState({
                approval: Approval.approving
            });
            moe_wallet.onApproval(on_approval);
            const nft_contract = await nft_wallet.contract;
            tx = await moe_wallet.increaseAllowance(
                nft_contract.address, MAX_UINT256 - old_allowance
            );
        } catch (ex) {
            this.setState({
                approval: Approval.error
            });
            this.error(ex);
        }
    }
    $batchMinter(
        list: List, approved: boolean | null
    ) {
        const { status } = this.state;
        const classes = [
            'btn btn-outline-warning',
            approved ? 'show' : ''
        ];
        const text = minting(status)
            ? 'Minting NFTs…'
            : 'Mint NFTs';
        return <button type='button' id='batch-minter'
            className={classes.join(' ')}
            disabled={this.disabled}
            onClick={this.batchMint.bind(this, list)}
        >
            {Spinner({
                show: !!minting(status), grow: true
            })}
            <span className='text'>{text}</span>
        </button>;
    }
    get disabled() {
        const { status } = this.state;
        if (minting(status)) {
            return true;
        }
        const { list } = this.props;
        if (!positives(list)) {
            return true;
        }
        return false;
    }
    async batchMint(
        list: List
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const nfts = [] as Array<{
            level: NftLevel; amount: Amount;
        }>;
        for (const level of NftLevels()) {
            const { amount } = list[level];
            if (amount) nfts.push({ level, amount });
        }
        const levels = nfts.map((nft) => nft.level);
        const amounts = nfts.map((nft) => nft.amount);
        const on_batch_tx: OnTransferBatch = async (
            op, from, to, ids, values, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            this.setState({
                status: Status.minted
            });
        };
        const nft_wallet = new NftWallet(address, App.token);
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.setState({
                status: Status.minting
            });
            nft_wallet.onTransferBatch(on_batch_tx);
            tx = await nft_wallet.mintBatch(levels, amounts);
        } catch (ex) {
            this.setState({
                status: Status.error
            });
            this.error(ex);
        }
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
    error(ex: any) {
        /* eslint no-ex-assign: [off] */
        if (ex.error) {
            ex = ex.error;
        }
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            const $ref = this.ref<HTMLElement>(
                'nft-batch-minter'
            );
            alert(ex.message, Alert.warning, {
                style: { margin: '-0.5em 0 0.5em 0' },
                after: $ref.current
            });
        }
        console.error(ex);
    }
    componentDidUpdate = buffered(() => {
        const $toggle = document.querySelector<HTMLElement>(
            '#toggle-all'
        );
        if ($toggle) {
            const title = this.title(this.state.toggled);
            if (title !== $toggle.dataset.bsOriginalTitle) {
                $toggle.dataset.bsOriginalTitle = title;
                Tooltip.getInstance($toggle)?.dispose();
                Tooltip.getOrCreateInstance($toggle);
            }
        }
        const $approval = document.querySelector<HTMLElement>(
            '#burn-approval'
        );
        if ($approval) {
            Tooltip.getInstance($approval)?.hide();
        }
    })
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
    list: List
) {
    const amounts = Object.values(list).map(
        ({ amount }) => amount
    );
    const positives = amounts.filter(
        (amount) => amount > 0n
    );
    return positives.length > 0;
}
export default NftMinter;
