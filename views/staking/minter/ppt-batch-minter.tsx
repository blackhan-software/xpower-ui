/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { OnStakeBatch, PptTreasuryFactory } from '../../../source/contract';
import { Transaction } from 'ethers';
import { Alerts, Alert, alert, x40 } from '../../../source/functions';
import { Amount, Token } from '../../../source/redux/types';
import { Nft, NftCoreId, NftLevels } from '../../../source/redux/types';
import { OtfWallet } from '../../../source/wallet';
import { Years } from '../../../source/years';

import React, { RefObject } from 'react';
import { List } from './index';
import { Spinner } from './index';

type Props = {
    approved: boolean | null;
    list: List; token: Token;
    container: RefObject<HTMLElement>;
}
type State = {
    status: Status | null;
}
enum Status {
    minting = 'minting',
    minted = 'minted',
    error = 'error'
}
function minting(
    status: Status | null
): boolean {
    return status === Status.minting;
}
export class PptBatchMinter extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            status: null
        };
    }
    render() {
        const { approved, list, token } = this.props;
        const { container } = this.props;
        const { status } = this.state;
        const classes = [
            'btn btn-outline-warning',
            approved ? 'show' : ''
        ];
        const disabled = () => {
            if (minting(status)) {
                return true;
            }
            if (!positives(list)) {
                return true;
            }
            return false;
        };
        const text = minting(status)
            ? <>Staking<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
            : <>Stake<span className="d-none d-sm-inline">&nbsp;NFTs</span></>;
        return <button type='button' id='batch-minter'
            className={classes.join(' ')} disabled={disabled()}
            onClick={this.batchMint.bind(
                this, token, list, container
            )}
        >
            {Spinner({
                show: !!minting(status), grow: true
            })}
            <span className='text'>{text}</span>
        </button>;
    }
    async batchMint(
        token: Token, list: List,
        container: RefObject<HTMLElement>
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const ppt_mints = [] as Array<{
            ppt_id: NftCoreId; amount: Amount;
        }>;
        for (const level of NftLevels()) {
            const { amount } = list[level];
            if (amount > 0n) {
                // stake from youngest to oldest (backwards):
                const issues = Array.from(Years()).reverse();
                let mint_amount = amount;
                for (const issue of issues) {
                    const ppt_total = App.getNftTotalBy({ level, issue });
                    if (ppt_total.amount === 0n) {
                        continue;
                    }
                    const ppt_id = Nft.coreId({ level, issue });
                    if (mint_amount >= ppt_total.amount) {
                        ppt_mints.push({
                            ppt_id, amount: ppt_total.amount
                        });
                        mint_amount -= ppt_total.amount;
                    } else {
                        ppt_mints.push({
                            ppt_id, amount: mint_amount
                        });
                        mint_amount = 0n;
                    }
                    if (mint_amount === 0n) {
                        break;
                    }
                }
            }
        }
        const ppt_ids = ppt_mints.map((mint) => mint.ppt_id);
        const amounts = ppt_mints.map((mint) => mint.amount);
        const on_stake_batch: OnStakeBatch = async (
            from, nftIds, amounts, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            this.setState({
                status: Status.minted
            });
        };
        const ppt_treasury = PptTreasuryFactory({
            token
        });
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.setState({
                status: Status.minting
            });
            ppt_treasury.then(
                (c) => c?.on('StakeBatch', on_stake_batch)
            );
            const contract = await OtfWallet.connect(
                await ppt_treasury
            );
            tx = await contract.stakeBatch(
                x40(address), ppt_ids, amounts
            );
        } catch (ex: any) {
            /* eslint no-ex-assign: [off] */
            if (ex.error) {
                ex = ex.error;
            }
            if (ex.message) {
                if (ex.data && ex.data.message) {
                    ex.message = `${ex.message} [${ex.data.message}]`;
                }
                alert(ex.message, Alert.warning, {
                    style: { margin: '-0.5em 0 0.5em 0' },
                    after: container.current
                });
            }
            this.setState({
                status: Status.error
            });
            console.error(ex);
        }
    }
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
export default PptBatchMinter;
