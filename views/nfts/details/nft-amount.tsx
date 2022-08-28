import { Amount, Nft } from '../../../source/redux/types';
import { NftIssue, NftLevel } from '../../../source/redux/types';

import React, { ChangeEvent, FormEvent } from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    balance: Amount;
    value: Amount | null;
    valid: boolean | null;
    onAmountChanged: (
        value: Amount | null,
        valid: boolean | null
    ) => void;
}
export class UiNftAmount extends React.Component<
    Props
> {
    render() {
        const { issue, level, balance, value } = this.props;
        return this.$amount(issue, level, balance, value);
    }
    $amount(
        nft_issue: NftIssue, nft_level: NftLevel,
        balance: Amount, value: Amount | null
    ) {
        const classes = [
            'form-control', this.validity(this.props.valid)
        ];
        return <React.Fragment>
            <label className='form-label nft-transfer-amount-label d-none d-sm-flex'>
                Send Amount
            </label>
            <div className='input-group nft-transfer-amount d-none d-sm-flex'
                data-level={Nft.nameOf(nft_level)} role='group'
            >
                <input type='number'
                    className={classes.join(' ')}
                    disabled={!balance} min='0' placeholder='0'
                    onChange={this.onChange.bind(this)}
                    onInput={this.onChange.bind(this)}
                    style={{ cursor: this.cursor(balance) }}
                    value={typeof value === 'bigint' ? value.toString() : ''}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Amount of minted ${Nft.nameOf(nft_level)} NFTs to send (for ${nft_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    cursor(
        balance: Amount
    ) {
        return balance ? 'text' : 'not-allowed'
    }
    validity(
        valid: boolean | null
    ) {
        if (valid === true) {
            return 'is-valid';
        }
        if (valid === false) {
            return 'is-invalid';
        }
        return '';
    }
    onChange(
        e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>
    ) {
        if (typeof this.props.onAmountChanged !== 'function') {
            return;
        }
        const $target = e.target as HTMLInputElement;
        let value: Amount | null;
        try {
            if ($target.value.match(/0x/i) === null) {
                value = BigInt($target.value);
            } else {
                value = 0n;
            }
        } catch (ex) {
            value = null;
        }
        if (value === null || !$target.value) {
            this.props.onAmountChanged(value, null);
        } else if (
            value > 0 && value <= this.props.balance
        ) {
            this.props.onAmountChanged(value, true);
        } else {
            this.props.onAmountChanged(value, false);
        }
    }
}
export default UiNftAmount;
