import { Blockchain } from '../../../source/blockchain';
import { Referable, x40 } from '../../../source/functions';
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
export class UiNftTarget extends Referable(
    React.Component<Props>
) {
    componentDidMount() {
        const $ref = this.ref<HTMLInputElement>(
            '.nft-transfer-to'
        );
        if ($ref.current && this.props.value !== null) {
            $ref.current.value = x40(this.props.value);
        }
    }
    render() {
        const { issue, level, balance } = this.props;
        return this.$target(issue, level, balance);
    }
    $target(
        nft_issue: NftIssue, nft_level: NftLevel, balance: Amount
    ) {
        const classes = [
            'form-control', this.validity(this.props.valid)
        ];
        return <React.Fragment>
            <label className='form-label nft-transfer-to-label d-none d-sm-flex'>
                Send To
            </label>
            <div className='input-group nft-transfer-to d-none d-sm-flex'
                role='group'
            >
                <input type='text'
                    className={classes.join(' ')}
                    disabled={!balance} placeholder='0x…'
                    onChange={this.onChange.bind(this)}
                    onInput={this.onChange.bind(this)}
                    ref={this.ref('.nft-transfer-to')}
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
            isAddress($target.value) &&
            !isZeroAddress($target.value) &&
            !isSameAddress($target.value, address)
        ) {
            this.props.onTargetChanged(value, true);
        } else {
            this.props.onTargetChanged(value, false);
        }
    }
}
function isAddress(value: string) {
    return value.match(/^0x([0-9a-f]{40}$)/i);
}
function isZeroAddress(value: string) {
    return value.match(new RegExp(`^${x40(0n)}$`, 'i'));
}
function isSameAddress(value: string, address: Address) {
    return value.match(new RegExp(`^${x40(address)}$`, 'i'));
}
export default UiNftTarget;
