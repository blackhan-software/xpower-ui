/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { OnUnstakeBatch, PptTreasuryFactory } from '../../../source/contract';
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
    burning = 'burning',
    burned = 'burned',
    error = 'error'
}
function burning(
    status: Status | null
): boolean {
    return status === Status.burning;
}
export class PptBatchBurner extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            status: null
        };
    }
    render() {
        const { approved, list, token } = this.props
        const { container } = this.props
        const { status } = this.state
        const classes = [
            'btn btn-outline-warning',
            approved ? 'show' : ''
        ];
        const disabled = () => {
            if (burning(status)) {
                return true;
            }
            if (!negatives(list)) {
                return true;
            }
            return false;
        };
        const text = burning(status)
            ? <>Unstaking<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
            : <>Unstake<span className="d-none d-sm-inline">&nbsp;NFTs</span></>;
        return <button type='button' id='batch-burner'
            className={classes.join(' ')} disabled={disabled()}
            onClick={this.batchBurn.bind(
                this, token, list, container
            )}
        >
            {Spinner({
                show: !!burning(status), grow: true
            })}
            <span className='text'>{text}</span>
        </button>;
    }
    async batchBurn(
        token: Token, list: List,
        container: RefObject<HTMLElement>
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const ppt_burns = [] as Array<{
            ppt_id: NftCoreId; amount: Amount;
        }>;
        for (const level of NftLevels()) {
            const { amount } = list[level];
            if (amount < 0n) {
                // unstake from oldest to youngest:
                const issues = Array.from(Years());
                let burn_amount = -amount;
                for (const issue of issues) {
                    const ppt_total = App.getPptTotalBy({ level, issue });
                    if (ppt_total.amount === 0n) {
                        continue;
                    }
                    const ppt_id = Nft.coreId({ level, issue });
                    if (burn_amount >= ppt_total.amount) {
                        ppt_burns.push({
                            ppt_id, amount: ppt_total.amount
                        });
                        burn_amount -= ppt_total.amount;
                    } else {
                        ppt_burns.push({
                            ppt_id, amount: burn_amount
                        });
                        burn_amount = 0n;
                    }
                    if (burn_amount === 0n) {
                        break;
                    }
                }
            }
        }
        const ppt_ids = ppt_burns.map((burn) => burn.ppt_id);
        const amounts = ppt_burns.map((burn) => burn.amount);
        const on_unstake_batch: OnUnstakeBatch = async (
            from, nftIds, amounts, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            this.setState({
                status: Status.burned
            });
        };
        const ppt_treasury = PptTreasuryFactory({
            token
        });
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.setState({
                status: Status.burning
            });
            ppt_treasury.then(
                (c) => c?.on('UnstakeBatch', on_unstake_batch)
            );
            const contract = await OtfWallet.connect(
                await ppt_treasury
            );
            tx = await contract.unstakeBatch(
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
function negatives(
    list: List
) {
    const amounts = Object.values(list).map(
        ({ amount }) => amount
    );
    const negatives = amounts.filter(
        (amount) => amount < 0n
    );
    return negatives.length > 0;
}
export default PptBatchBurner;
