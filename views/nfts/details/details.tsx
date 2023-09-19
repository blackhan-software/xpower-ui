import { Bus } from '../../../source/bus';
import { nice } from '../../../source/functions';
import { ROParams } from '../../../source/params';
import { globalRef } from '../../../source/react';
import { Amount, Nft, NftDetails, NftIssue, NftLevel, Nfts, Supply } from '../../../source/redux/types';
import { MAX_YEAR, MIN_YEAR, Years } from '../../../source/years';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { UiNftAmount } from './nft-amount';
import { UiNftExpander } from './nft-expander';
import { UiNftImage } from './nft-image';
import { UiNftSender } from './nft-sender';
import { UiNftTarget } from './nft-target';

type Props = {
    nfts: Nfts;
    level: NftLevel;
    details: NftDetails;
    onNftImageLoaded?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onNftSenderExpanded?: (
        issue: NftIssue,
        level: NftLevel,
        expanded: boolean
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
export function UiNftDetails(
    props: Props
) {
    const issues = Array.from(Years({ reverse: true }));
    return <React.Fragment>{
        issues.map((issue) => $row(props, issue))
    }</React.Fragment>;
}
function $row(
    props: Props, nft_issue: NftIssue
) {
    const { level: nft_level } = props;
    const by_level = props.details[nft_level];
    const by_issue = by_level[nft_issue];
    const { fixed, toggled } = by_issue;
    const full_id = Nft.fullId({
        issue: nft_issue,
        level: nft_level
    });
    const nft = props.nfts.items[full_id] ?? {
        amount: 0n, supply: 0n
    };
    return <React.Fragment key={full_id}>
        <div className='row year'
            ref={globalRef(`:nft.row[full-id="${full_id}"]`)}
            style={{ display: (fixed || toggled) ? 'flex' : 'none' }}
        >
            <div className='col-sm nft-details-lhs'>
                {$image(props, nft_issue)}
            </div>
            <div className='col-sm nft-details-rhs'>
                {$issue(props, nft_issue)}
                {$balance(props, nft_issue, nft)}
                {$supply(props, nft_issue, nft)}
                {$expander(props, nft_issue)}
                {$target(props, nft_issue, nft)}
                {$amount(props, nft_issue, nft)}
                {$sender(props, nft_issue)}
            </div>
        </div>
        <hr className='year' style={{
            display: (fixed || toggled) &&
                !lastHR(nft_level, nft_issue, toggled) ? 'block' : 'none'
        }} />
    </React.Fragment>;
}
function $image(
    props: Props, nft_issue: NftIssue
) {
    const { details, level: nft_level } = props;
    const by_level = details[nft_level];
    const by_issue = by_level[nft_issue];
    const { image, fixed, toggled } = by_issue;
    return <UiNftImage
        issue={nft_issue}
        level={nft_level}
        toggled={fixed || toggled}
        url_content={image.url_content}
        url_market={image.url_market}
        loading={image.loading}
        onLoaded={() => {
            if (props.onNftImageLoaded) {
                props.onNftImageLoaded(
                    nft_issue, nft_level
                );
            }
        }}
    />;
}
function $issue(
    props: Props, nft_issue: NftIssue
) {
    const { level: nft_level } = props;
    return <React.Fragment>
        <div className='form-label'>
            Year of Issuance
        </div>
        <div className='input-group nft-issuance-year'>
            <input className='form-control' readOnly
                type='number' value={nft_issue}
                name={`nft-issuance-year-${nft_level}-${nft_issue}`}
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
function $balance(
    props: Props, nft_issue: NftIssue,
    { amount: balance }: { amount: Amount }
) {
    const { level: nft_level } = props;
    return <React.Fragment>
        <div className='form-label'>
            Personal Balance
        </div>
        <div className='input-group nft-balance'>
            <input className='form-control' readOnly
                type='text' value={nice(balance)}
                name={`nft-balance-${nft_level}-${nft_issue}`}
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
function $supply(
    props: Props, nft_issue: NftIssue,
    { supply }: { supply: Supply }
) {
    const { level: nft_level } = props;
    return <React.Fragment>
        <div className='form-label'>
            Total Supply
        </div>
        <div className='input-group nft-total-supply'>
            <input className='form-control' readOnly
                type='text' value={nice(supply)}
                name={`nft-total-supply-${nft_level}-${nft_issue}`}
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
function $expander(
    props: Props, nft_issue: NftIssue
) {
    const { details, level: nft_level } = props;
    const by_level = details[nft_level];
    const by_issue = by_level[nft_issue];
    const { expanded, toggled } = by_issue;
    return <UiNftExpander
        issue={nft_issue}
        level={nft_level}
        onExpanded={((expanded) => {
            if (props.onNftSenderExpanded) {
                props.onNftSenderExpanded(
                    nft_issue, nft_level, expanded
                );
            }
        })}
        onToggled={(flag) => {
            Bus.emit('toggle-issue', { flag });
        }}
        expanded={expanded}
        toggled={toggled}
    />;
}
function $target(
    props: Props, nft_issue: NftIssue,
    { amount: balance }: { amount: Amount }
) {
    const { details, level: nft_level } = props;
    const by_level = details[nft_level];
    const by_issue = by_level[nft_issue];
    const { target } = by_issue;
    return <UiNftTarget
        issue={nft_issue}
        level={nft_level}
        balance={balance}
        value={target.value}
        valid={target.valid}
        onTargetChanged={(value, flag) => {
            if (props.onNftTargetChanged) {
                props.onNftTargetChanged(
                    nft_issue, nft_level, value, flag
                );
            }
        }}
    />;
}
function $amount(
    props: Props, nft_issue: NftIssue,
    { amount: balance }: { amount: Amount }
) {
    const { details, level: nft_level } = props;
    const by_level = details[nft_level];
    const by_issue = by_level[nft_issue];
    const { amount } = by_issue;
    return <UiNftAmount
        issue={nft_issue}
        level={nft_level}
        balance={balance}
        value={amount.value}
        valid={amount.valid}
        onAmountChanged={(value, flag) => {
            if (props.onNftAmountChanged) {
                props.onNftAmountChanged(
                    nft_issue, nft_level, value, flag
                );
            }
        }}
    />;
}
function $sender(
    props: Props, nft_issue: NftIssue
) {
    const { details, level: nft_level } = props;
    const { amount, target } = details[nft_level][nft_issue];
    const { toggled, sender } = details[nft_level][nft_issue];
    return <UiNftSender
        issue={nft_issue}
        level={nft_level}
        amount={amount}
        target={target}
        status={sender.status}
        onTransfer={props.onNftTransfer}
        onToggled={(flag) => {
            Bus.emit('toggle-issue', { flag });
        }}
        toggled={toggled}
    />;
}
function lastHR(
    level: NftLevel,
    issue: NftIssue,
    toggled: boolean
) {
    const level_max = level === ROParams.nftLevel.max;
    if (level_max) {
        const issue_min = issue === MIN_YEAR();
        const issue_max = issue === MAX_YEAR();
        return toggled ? issue_min : issue_max;
    }
    return false;
}
export default UiNftDetails;
