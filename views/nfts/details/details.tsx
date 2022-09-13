import { App } from '../../../source/app';
import { Referable } from '../../../source/functions';
import { Address, Amount, Supply, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel, NftLevels } from '../../../source/redux/types';
import { Years } from '../../../source/years';

import React from 'react';
import { UiNftImage, nft_meta, nft_href } from './nft-image';
export { UiNftImage, nft_meta, nft_href };
import { UiNftTarget } from './nft-target';
import { UiNftAmount } from './nft-amount';
import { UiNftSender } from './nft-sender';
import { NftSenderStatus } from './nft-sender';
export { NftSenderStatus };
import { UiNftExpander } from './nft-expander';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
    level: NftLevel;
    details: NftDetails;
    onNftImageLoaded?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onNftSenderExpanded?: (
        issues: NftIssue[],
        level: NftLevel,
        toggled: boolean
    ) => void;
    onNftTargetChanged?: (
        issue: NftIssue,
        level: NftLevel,
        value: Amount | null,
        valid: boolean | null
    ) => void;
    onNftAmountChanged?: (
        issue: NftIssue,
        level: NftLevel,
        value: Amount | null,
        valid: boolean | null
    ) => void;
    onNftTransfer?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
}
export type NftDetails = Record<NftLevel, Record<NftIssue, {
    image: {
        url_content: string | null;
        url_market: string | null;
        loading: boolean;
    };
    target: {
        valid: boolean | null;
        value: Address | null;
    };
    amount: {
        valid: boolean | null;
        value: Amount | null;
    };
    sender: {
        status: NftSenderStatus | null;
    };
    fixed: boolean;
    toggled: boolean;
}>>
export function nft_details(
    image = {
        loading: true, url_market: null, url_content: null
    },
    target = {
        valid: null, value: null
    },
    amount = {
        valid: null, value: null
    },
    sender = {
        status: null
    }
) {
    const issues = Array.from(Years()).reverse();
    const levels = Array.from(NftLevels());
    const details = Object.fromEntries(
        levels.map((level) => [level, Object.fromEntries(
            issues.map((issue) => [issue, {
                amount,
                fixed: issues[0] - issue ? false : true,
                image,
                sender,
                target,
                toggled: false,
            }])
        )])
    );
    return details as NftDetails;
}
export class UiNftDetails extends Referable(React.Component)<
    Props
> {
    render() {
        const years = Array.from(Years({ reverse: true }));
        const level = this.props.level;
        return <React.Fragment>{
            years.map((issue) => this.$row(issue, level))
        }</React.Fragment>;
    }
    $row(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const by_level = this.props.details[nft_level];
        const by_issue = by_level[nft_issue];
        const { fixed, toggled } = by_issue;
        const nft_token = Nft.token(
            this.props.token
        );
        const core_id = Nft.coreId({
            issue: nft_issue,
            level: nft_level,
        });
        const full_id = Nft.fullId({
            issue: nft_issue,
            level: nft_level,
            token: nft_token
        });
        const nfts = App.getNfts({
            issue: nft_issue,
            level: nft_level,
            token: nft_token
        });
        const nft = nfts.items[full_id] ?? {
            amount: 0n, supply: 0n
        };
        return <React.Fragment key={core_id}>
            <div className='row year'
                data-year={nft_issue}
                data-state={fixed || toggled ? 'on' : 'off'}
                ref={this.global_ref(`nft:${core_id}`)}
                style={{
                    display: fixed || toggled ? 'flex' : 'none'
                }}
            >
                <div className='col-sm nft-details-lhs'>
                    {this.$image(nft_issue, nft_level)}
                </div>
                <div className='col-sm nft-details-rhs'>
                    {this.$issue(nft_issue, nft_level)}
                    {this.$balance(nft_issue, nft_level, nft)}
                    {this.$supply(nft_issue, nft_level, nft)}
                    {this.$expander(nft_issue, nft_level)}
                    {this.$target(nft_issue, nft_level, nft)}
                    {this.$amount(nft_issue, nft_level, nft)}
                    {this.$sender(nft_issue, nft_level)}
                </div>
            </div>
            <hr className='year' style={{
                display: fixed || toggled ? 'block' : 'none'
            }} />
        </React.Fragment>;
    }
    $image(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const by_level = this.props.details[nft_level];
        const by_issue = by_level[nft_issue];
        const { image, fixed, toggled } = by_issue;
        const { token } = this.props;
        return <UiNftImage
            token={token}
            issue={nft_issue}
            level={nft_level}
            toggled={fixed || toggled}
            url_content={image.url_content}
            url_market={image.url_market}
            loading={image.loading}
            onLoaded={() => {
                if (this.props.onNftImageLoaded) {
                    this.props.onNftImageLoaded(
                        nft_issue, nft_level
                    );
                }
            }}
        />;
    }
    $issue(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        return <React.Fragment>
            <label className='form-label'>
                Year of Issuance
            </label>
            <div className='input-group nft-issuance-year'>
                <input className='form-control' readOnly
                    type='number' value={nft_issue}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Year of issuance of these ${Nft.nameOf(nft_level)} NFTs`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $balance(
        nft_issue: NftIssue, nft_level: NftLevel,
        { amount: balance }: { amount: Amount }
    ) {
        return <React.Fragment>
            <label className='form-label'>
                Personal Balance
            </label>
            <div className='input-group nft-balance'>
                <input className='form-control' readOnly
                    type='number' value={balance.toString()}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Personal balance of ${Nft.nameOf(nft_level)} NFTs (for ${nft_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $supply(
        nft_issue: NftIssue, nft_level: NftLevel,
        { supply }: { supply: Supply }
    ) {
        return <React.Fragment>
            <label className='form-label'>
                Total Supply
            </label>
            <div className='input-group nft-total-supply'>
                <input className='form-control' readOnly
                    type='number' value={supply.toString()}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Total supply of ${Nft.nameOf(nft_level)} NFTs minted so far (for ${nft_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $expander(
        nft_issue: NftIssue, nft_level: NftLevel,
    ) {
        const by_level = this.props.details[nft_level];
        const by_issue = by_level[nft_issue];
        const { toggled } = by_issue;
        return <UiNftExpander
            issue={nft_issue}
            level={nft_level}
            onToggled={(flag) => {
                if (this.props.onNftSenderExpanded) {
                    const issues = Array.from(Years());
                    this.props.onNftSenderExpanded(
                        issues, nft_level, flag
                    );
                }
                App.event.emit('toggle-issue', {
                    level: nft_level, flag
                });
            }}
            toggled={toggled}
        />;
    }
    $target(
        nft_issue: NftIssue, nft_level: NftLevel,
        { amount: balance }: { amount: Amount }
    ) {
        const by_level = this.props.details[nft_level];
        const by_issue = by_level[nft_issue];
        const { target } = by_issue;
        return <UiNftTarget
            issue={nft_issue}
            level={nft_level}
            balance={balance}
            value={target.value}
            valid={target.valid}
            onTargetChanged={(value, flag) => {
                if (this.props.onNftTargetChanged) {
                    this.props.onNftTargetChanged(
                        nft_issue, nft_level, value, flag
                    );
                }
            }}
        />;
    }
    $amount(
        nft_issue: NftIssue, nft_level: NftLevel,
        { amount: balance }: { amount: Amount }
    ) {
        const by_level = this.props.details[nft_level];
        const by_issue = by_level[nft_issue];
        const { amount } = by_issue;
        return <UiNftAmount
            issue={nft_issue}
            level={nft_level}
            balance={balance}
            value={amount.value}
            valid={amount.valid}
            onAmountChanged={(value, flag) => {
                if (this.props.onNftAmountChanged) {
                    this.props.onNftAmountChanged(
                        nft_issue, nft_level, value, flag
                    );
                }
            }}
        />;
    }
    $sender(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const { token, details: matrix } = this.props;
        const { amount, target } = matrix[nft_level][nft_issue];
        const { toggled, sender } = matrix[nft_level][nft_issue];
        return <UiNftSender
            issue={nft_issue}
            level={nft_level}
            amount={amount}
            target={target}
            status={sender.status}
            onTransfer={
                this.props.onNftTransfer?.bind(this)
            }
            onToggled={(flag, ctrl_key) => {
                const level = !ctrl_key ? nft_level : undefined;
                App.event.emit('toggle-issue', { level, flag });
            }}
            toggled={toggled}
            token={token}
        />;
    }
}
export default UiNftDetails;
