/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { PptTreasuryFactory } from '../../../source/contract';
import { Alert, alert } from '../../../source/functions';
import { buffered, Referable } from '../../../source/functions';
import { Amount, Token } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { NftWallet, OnApprovalForAll } from '../../../source/wallet';
import { Tooltip } from '../../tooltips';

import { PptBatchMinter } from './ppt-batch-minter';
export { PptBatchMinter };
import { PptBatchBurner } from './ppt-batch-burner';
export { PptBatchBurner };

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
    list: List;
    onList?: (list: Partial<List>) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export type List = Record<NftLevel, {
    amount: Amount;
    max: Amount;
    min: Amount;
    display: boolean;
    toggled: boolean;
}>
type State = {
    approval: Approval | null;
}
enum Approval {
    approving = 'approving',
    approved = 'approved',
    error = 'error'
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
export class PptMinter extends Referable(React.Component)<
    Props, State
> {
    constructor(
        props: Props
    ) {
        super(props);
        this.state = {
            approval: null
        };
        this.events();
    }
    events() {
        Blockchain.onConnect(async/*set-approval*/({
            address, token
        }) => {
            const ppt_treasury = PptTreasuryFactory({ token });
            const nft_wallet = new NftWallet(address, token);
            const approved = await nft_wallet.isApprovedForAll(
                await ppt_treasury.then((c) => c?.address)
            );
            if (approved) {
                this.setState({ approval: Approval.approved });
            } else {
                this.setState({ approval: null });
            }
        });
    }
    render() {
        const { list, toggled, token } = this.props;
        const { approval } = this.state;
        return <div
            className='btn-group ppt-batch-minter'
            ref={this.ref('ppt-batch-minter')}
            role='group'
        >
            {this.$toggleAll(toggled)}
            {this.$burnApproval(
                token, approved(approval), approving(approval)
            )}
            {this.$pptBatchMinter(
                token, list, approved(approval),
            )}
            {this.$pptBatchBurner(
                token, list, approved(approval)
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
        const { onList } = this.props;
        if (onList) onList(
            Object.fromEntries(entries)
        );
        const { onToggled } = this.props;
        if (onToggled) onToggled(!toggled);
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
            onClick={this.approve.bind(this, token)}
            style={{ display: !approved ? 'block' : 'none' }}
            title={`Approve staking (and unstaking) of NFTs`}
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
        const ppt_treasury = PptTreasuryFactory({
            token
        });
        const nft_wallet = new NftWallet(address, token);
        const approved = await nft_wallet.isApprovedForAll(
            address
        );
        if (approved) {
            this.setState({
                approval: Approval.approved
            });
        } else {
            const on_approval: OnApprovalForAll = (
                account, op, flag, ev
            ) => {
                if (ev.transactionHash !== tx?.hash) {
                    return;
                }
                this.setState({
                    approval: Approval.approved
                });
            };
            let tx: Transaction | undefined;
            try {
                this.setState({
                    approval: Approval.approving
                });
                nft_wallet.onApprovalForAll(on_approval);
                tx = await nft_wallet.setApprovalForAll(
                    await ppt_treasury.then((c) => c.address), true
                );
            } catch (ex) {
                this.setState({
                    approval: Approval.error
                });
                console.error(ex);
            }
        }
    }
    $pptBatchMinter(
        token: Token, list: List, approved: boolean | null
    ) {
        return <PptBatchMinter
            approved={approved} list={list} token={token}
            container={this.ref<HTMLElement>('ppt-batch-minter')}
        />;
    }
    $pptBatchBurner(
        token: Token, list: List, approved: boolean | null
    ) {
        return <PptBatchBurner
            approved={approved} list={list} token={token}
            container={this.ref<HTMLElement>('ppt-batch-minter')}
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
                'ppt-batch-minter'
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
            const title = this.title(this.props.toggled);
            if (title !== $toggle.dataset.bsOriginalTitle) {
                $toggle.dataset.bsOriginalTitle = title;
                Tooltip.getInstance($toggle)?.dispose();
                Tooltip.getOrCreateInstance($toggle);
            }
        }
        const $approval = document.querySelector<HTMLElement>(
            '#ppt-burn-approval'
        );
        if ($approval) {
            Tooltip.getInstance($approval)?.hide();
        }
    })
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
export default PptMinter;
