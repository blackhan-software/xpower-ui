import { Blockchain } from '../../../source/blockchain';
import { x40 } from '../../../source/functions';
import { Address, Amount, Nft } from '../../../source/redux/types';
import { NftIssue, NftLevel } from '../../../source/redux/types';

import React, { ChangeEvent, FormEvent } from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    balance: Amount;
    value: Address | null;
    valid: boolean | null;
    onTargetChanged: (
        value: Address | null,
        valid: boolean | null
    ) => void;
}
export class UiNftTarget extends React.Component<
    Props
> {
    render() {
        const { issue, level, balance, value } = this.props;
        return this.$target(issue, level, balance, value);
    }
    $target(
        nft_issue: NftIssue, nft_level: NftLevel,
        balance: Amount, value: Address | null
    ) {
        const classes = [
            'form-control', this.validity(this.props.valid)
        ];
        return <React.Fragment>
            <label className='form-label nft-transfer-to-label d-none d-sm-flex'>
                Send To
            </label>
            <div className='input-group nft-transfer-to d-none d-sm-flex'
                data-level={Nft.nameOf(nft_level)} role='group'
            >
                <input type='text' key={this.rekey(value)}
                    className={classes.join(' ')}
                    disabled={!balance} placeholder='0x…'
                    onChange={this.onChange.bind(this)}
                    onInput={this.onChange.bind(this)}
                    style={{ cursor: this.cursor(balance) }}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Address to send minted ${Nft.nameOf(nft_level)} NFTs to (for ${nft_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    cursor(
        balance: Amount
    ) {
        return balance ? 'text' : 'not-allowed';
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
    async onChange(
        e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>
    ) {
        if (typeof this.props.onTargetChanged !== 'function') {
            return;
        }
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const $target = e.target as HTMLInputElement;
        let value: Amount | null;
        try {
            if ($target.value.match(/^0x([0-9a-f]{40})/i) !== null) {
                value = BigInt($target.value);
            } else {
                value = 0n;
            }
        } catch (ex) {
            value = null;
        }
        if (value === null || !$target.value) {
            this.props.onTargetChanged(value, null);
        } else if (
            $target.value.match(/^0x([0-9a-f]{40})/i) &&
            !$target.value.match(new RegExp(x40(address), 'i'))
        ) {
            this.props.onTargetChanged(value, true);
        } else {
            this.props.onTargetChanged(value, false);
        }
    }
    /**
     * If value is null, then a new key is generated
     * resetting the input field back to its default.
     */
    rekey(
        value: Address | null
    ) {
        if (this._key === undefined || value === null) {
            this._key = String.random();
        }
        return this._key;
    }
    private _key?: string;
}
export default UiNftTarget;
