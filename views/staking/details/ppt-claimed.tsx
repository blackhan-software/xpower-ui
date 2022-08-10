import { Amount, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    token: Token;
    value: Amount | null;
}
export class PptClaimed extends React.Component<
    Props
> {
    render() {
        const { issue, level, token, value } = this.props;
        return this.$amount(issue, level, token, value);
    }
    $amount(
        nft_issue: NftIssue, nft_level: NftLevel,
        token: Token, value: Amount | null
    ) {
        return <React.Fragment>
            <label className='form-label nft-claimed-label d-none d-sm-flex'>
                Claimed Amount
            </label>
            <div className='input-group nft-claimed d-none d-sm-flex'
                data-level={Nft.nameOf(nft_level)} role='group'
            >
                <input type='number'
                    className='form-control'
                    placeholder='0' readOnly
                    value={typeof value === 'bigint' ? value.toString() : ''}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Amount of claimed ${token} rewards so far (for ${nft_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
}
export default PptClaimed;
