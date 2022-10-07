import { Unsubscribe } from 'redux';
import { Blockchain } from '../../../source/blockchain';
import { Bus } from '../../../source/bus';
import { MoeTreasuryFactory } from '../../../source/contract';
import { Referable, Updatable, x40 } from '../../../source/functions';
import { onPptChanged } from '../../../source/redux/observers';
import { Store } from '../../../source/redux/store';
import { Amount, Nft, NftFullId, NftIssue, NftLevel, NftLevels, Nfts, NftToken, NftTokens, PptDetails, Supply, Token } from '../../../source/redux/types';
import { Years } from '../../../source/years';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { UiPptClaimable } from './ppt-claimable';
import { UiPptClaimed } from './ppt-claimed';
import { UiPptClaimer } from './ppt-claimer';
import { UiPptExpander } from './ppt-expander';
import { UiPptImage } from './ppt-image';


type Props = {
    ppts: Nfts;
    token: Token;
    level: NftLevel;
    details: PptDetails;
    onPptImageLoaded?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onPptClaimerExpanded?: (
        issue: NftIssue,
        level: NftLevel,
        expanded: boolean
    ) => void;
    onPptTargetChanged?: (
        issue: NftIssue,
        level: NftLevel,
        value: Amount | null,
        valid: boolean | null
    ) => void;
    onPptAmountChanged?: (
        issue: NftIssue,
        level: NftLevel,
        value: Amount | null,
        valid: boolean | null
    ) => void;
    onPptTransfer?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onPptClaim?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
}
type State = Record<NftLevel, Record<NftIssue, {
    claimable: Record<NftToken, Amount>;
    claimed: Record<NftToken, Amount>;
}>>
function state(
    claimable = 0n, claimed = 0n
) {
    const ppt_tokens = Array.from(NftTokens());
    const ppt_issues = Array.from(Years({ reverse: true }));
    const ppt_levels = Array.from(NftLevels());
    const state = Object.fromEntries(
        ppt_levels.map((level) => [level, Object.fromEntries(
            ppt_issues.map((issue) => [issue, {
                claimable: Object.assign({}, ...ppt_tokens.map((t) => ({
                    [t]: claimable
                }))),
                claimed: Object.assign({}, ...ppt_tokens.map((t) => ({
                    [t]: claimed
                }))),
            }])
        )])
    );
    return state as State;
}
export class UiPptDetails extends Referable(Updatable(
    React.Component<Props, State>
)) {
    constructor(props: Props) {
        super(props);
        this.state = state();
    }
    async componentDidMount() {
        this.unPptChanged = onPptChanged(Store.store, (
            full_id: NftFullId
        ) => {
            const ppt_token = Nft.token(full_id);
            if (ppt_token !== Nft.token(
                this.props.token
            )) {
                return;
            }
            const ppt_level = Nft.level(full_id);
            if (ppt_level !== this.props.level) {
                return;
            }
            const ppt_issue = Nft.issue(full_id);
            if (ppt_issue === 0) {
                return;
            }
            this.reset(
                ppt_token, ppt_level, ppt_issue
            );
        });
        Array.from(Years()).forEach((
            issue: NftIssue
        ) => {
            const core_id = Nft.coreId({
                level: this.props.level, issue
            });
            const ref = this.globalRef<HTMLElement>(
                `:ppt.row[core-id="${core_id}"]`
            );
            ref.current?.addEventListener('refresh-claims', () => {
                const { token, level } = this.props;
                this.reset(Nft.token(token), level, issue);
            });
            const { token, level } = this.props;
            this.reset(Nft.token(token), level, issue);
        });
    }
    componentWillUnmount() {
        if (this.unPptChanged) {
            this.unPptChanged();
        }
    }
    async reset(
        ppt_token: NftToken,
        ppt_level: NftLevel,
        ppt_issue: NftIssue
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const avalanche = await Blockchain.isAvalanche();
        if (!avalanche) {
            throw new Error('wrong chain');
        }
        const core_id = Nft.coreId({
            issue: ppt_issue, level: ppt_level
        });
        const moe_treasury = MoeTreasuryFactory({
            token: this.props.token
        });
        const [claimed, claimable] = await Promise.all([
            await moe_treasury.then(
                (c) => c.claimedFor(x40(address), core_id)
            ),
            await moe_treasury.then(
                (c) => c.claimableFor(x40(address), core_id)
            )
        ]);
        await this.update({
            [ppt_level]: {
                [ppt_issue]: {
                    claimable: {
                        [ppt_token]: claimable.toBigInt()
                    },
                    claimed: {
                        [ppt_token]: claimed.toBigInt()
                    }
                }
            }
        });
    }
    render() {
        const years = Array.from(Years({ reverse: true }));
        const { ppts, level } = this.props;
        return <React.Fragment>{
            years.map((issue) => this.$row(ppts, issue, level))
        }</React.Fragment>;
    }
    $row(
        ppts: Nfts, ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const by_level = this.props.details[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { fixed, toggled } = by_issue;
        const ppt_token = Nft.token(
            this.props.token
        );
        const core_id = Nft.coreId({
            issue: ppt_issue,
            level: ppt_level
        });
        const full_id = Nft.fullId({
            issue: ppt_issue,
            level: ppt_level,
            token: ppt_token
        });
        const ppt = ppts.items[full_id] ?? {
            amount: 0n, supply: 0n
        };
        return <React.Fragment key={core_id}>
            <div className='row year'
                ref={this.globalRef(`:ppt.row[core-id="${core_id}"]`)}
                style={{ display: fixed || toggled ? 'flex' : 'none' }}
            >
                <div className='col-sm nft-details-lhs'>
                    {this.$image(ppt_issue, ppt_level)}
                </div>
                <div className='col-sm nft-details-rhs'>
                    {this.$issue(ppt_issue, ppt_level)}
                    {this.$balance(ppt_issue, ppt_level, ppt)}
                    {this.$supply(ppt_issue, ppt_level, ppt)}
                    {this.$expander(ppt_issue, ppt_level)}
                    {this.$claimed(ppt_issue, ppt_level, ppt_token)}
                    {this.$claimable(ppt_issue, ppt_level, ppt_token)}
                    {this.$claimer(ppt_issue, ppt_level, ppt_token)}
                </div>
            </div>
            <hr className='year' style={{
                display: fixed || toggled ? 'block' : 'none'
            }} />
        </React.Fragment>;
    }
    $image(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const by_level = this.props.details[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { image, fixed, toggled } = by_issue;
        const { token } = this.props;
        return <UiPptImage
            issue={ppt_issue}
            level={ppt_level}
            loading={image.loading}
            onLoaded={() => {
                if (this.props.onPptImageLoaded) {
                    this.props.onPptImageLoaded(
                        ppt_issue, ppt_level
                    );
                }
            }}
            toggled={fixed || toggled}
            token={token}
            url_content={image.url_content}
            url_market={image.url_market}
        />;
    }
    $issue(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        return <React.Fragment>
            <label className='form-label'>
                Year of Issuance
            </label>
            <div className='input-group nft-issuance-year'>
                <input className='form-control' readOnly
                    type='number' value={ppt_issue}
                />
                <span className='input-group-text info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    title={`Year of issuance of these staked ${Nft.nameOf(ppt_level)} NFTs`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $balance(
        ppt_issue: NftIssue, ppt_level: NftLevel,
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
                    title={`Personal balance of ${Nft.nameOf(ppt_level)} NFTs staked (for ${ppt_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $supply(
        ppt_issue: NftIssue, ppt_level: NftLevel,
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
                    title={`Total supply of ${Nft.nameOf(ppt_level)} NFTs staked so far (for ${ppt_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $expander(
        ppt_issue: NftIssue, ppt_level: NftLevel,
    ) {
        const by_level = this.props.details[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { expanded, toggled } = by_issue;
        return <UiPptExpander
            issue={ppt_issue}
            level={ppt_level}
            onExpanded={((expanded) => {
                if (this.props.onPptClaimerExpanded) {
                    this.props.onPptClaimerExpanded(
                        ppt_issue, ppt_level, expanded
                    );
                }
            })}
            onToggled={(toggled) => {
                Bus.emit('toggle-issue', {
                    flag: toggled
                });
            }}
            expanded={expanded}
            toggled={toggled}
        />;
    }
    $claimed(
        ppt_issue: NftIssue, ppt_level: NftLevel, ppt_token: NftToken
    ) {
        const { token } = this.props;
        const by_level = this.state[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { claimed } = by_issue;
        return <UiPptClaimed
            issue={ppt_issue}
            token={token}
            value={claimed[ppt_token]}
        />;
    }
    $claimable(
        ppt_issue: NftIssue, ppt_level: NftLevel, ppt_token: NftToken
    ) {
        const { token } = this.props;
        const by_level = this.state[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { claimable } = by_issue;
        return <UiPptClaimable
            issue={ppt_issue}
            token={token}
            value={claimable[ppt_token]}
        />;
    }
    $claimer(
        ppt_issue: NftIssue, ppt_level: NftLevel, ppt_token: NftToken
    ) {
        const { token, details } = this.props;
        const { claimable, claimed } = this.state[ppt_level][ppt_issue];
        const { claimer, toggled } = details[ppt_level][ppt_issue];
        return <UiPptClaimer
            issue={ppt_issue}
            level={ppt_level}
            claimable={claimable[ppt_token]}
            claimed={claimed[ppt_token]}
            onClaim={
                this.props.onPptClaim?.bind(this)
            }
            onToggled={(toggled) => {
                Bus.emit('toggle-issue', {
                    flag: toggled
                });
            }}
            status={claimer.status}
            toggled={toggled}
            token={token}
        />;
    }
    unPptChanged: Unsubscribe | undefined;
}
export default UiPptDetails;
