import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { MoeTreasuryFactory } from '../../../source/contract';
import { Referable, Updatable, x40 } from '../../../source/functions';
import { Address, Amount, Supply, Token } from '../../../source/redux/types';
import { NftToken, NftTokens } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { Nft, NftFullId, NftIssue } from '../../../source/redux/types';
import { Years } from '../../../source/years';

import React from 'react';
import { UiPptImage, ppt_meta, ppt_href } from './ppt-image';
export { UiPptImage, ppt_meta, ppt_href };
import { UiPptClaimable } from './ppt-claimable';
import { UiPptClaimed } from './ppt-claimed';
import { UiPptClaimer } from './ppt-claimer';
import { PptClaimerStatus } from './ppt-claimer';
export { PptClaimerStatus };
import { UiPptExpander } from './ppt-expander';
import { InfoCircle } from '../../../public/images/tsx';
import { Unsubscribe } from 'redux';

type Props = {
    token: Token;
    level: NftLevel;
    details: PptDetails;
    onPptImageLoaded?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onPptClaimerExpanded?: (
        issues: NftIssue[],
        level: NftLevel,
        toggled: boolean
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
export type PptDetails = Record<NftLevel, Record<NftIssue, {
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
    claimer: {
        status: PptClaimerStatus | null;
    };
    fixed: boolean;
    toggled: boolean;
}>>
export function ppt_details(
    image = {
        loading: true, url_market: null, url_content: null
    },
    target = {
        valid: null, value: null
    },
    amount = {
        valid: null, value: null
    },
    claimer = {
        status: null
    }
) {
    const issues = Array.from(Years()).reverse();
    const levels = Array.from(NftLevels());
    const state = Object.fromEntries(
        levels.map((level) => [level, Object.fromEntries(
            issues.map((issue) => [issue, {
                amount,
                fixed: issues[0] - issue ? false : true,
                image,
                claimer,
                target,
                toggled: false,
            }])
        )])
    );
    return state as PptDetails;
}
type State = Record<NftLevel, Record<NftIssue, {
    claimable: Record<NftToken, Amount>;
    claimed: Record<NftToken, Amount>;
}>>
function state(
    claimable = 0n, claimed = 0n
) {
    const tokens = Array.from(NftTokens());
    const issues = Array.from(Years({ reverse: true }));
    const levels = Array.from(NftLevels());
    const state = Object.fromEntries(
        levels.map((level) => [level, Object.fromEntries(
            issues.map((issue) => [issue, {
                claimable: Object.assign({}, ...tokens.map((t) => ({
                    [t]: claimable
                }))),
                claimed: Object.assign({}, ...tokens.map((t) => ({
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
        this.unPptChanged = App.onPptChanged((
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
            const ref = this.global_ref<HTMLElement>(
                `ppt:${core_id}`
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
        const level = this.props.level;
        return <React.Fragment>{
            years.map((issue) => this.$row(issue, level))
        }</React.Fragment>;
    }
    $row(
        ppt_issue: NftIssue, ppt_level: NftLevel
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
        const ppts = App.getPpts({
            issue: ppt_issue,
            level: ppt_level,
            token: ppt_token
        });
        const ppt = ppts.items[full_id] ?? {
            amount: 0n, supply: 0n
        };
        return <React.Fragment key={core_id}>
            <div className='row year'
                data-year={ppt_issue}
                data-state={fixed || toggled ? 'on' : 'off'}
                ref={this.global_ref(`ppt:${core_id}`)}
                style={{
                    display: fixed || toggled ? 'flex' : 'none'
                }}
            >
                <div className='col-sm nft-details-lhs'>
                    {this.$image(ppt_issue, ppt_level)}
                </div>
                <div className='col-sm nft-details-rhs'>
                    {this.$issue(ppt_issue, ppt_level)}
                    {this.$balance(ppt_issue, ppt_level, ppt)}
                    {this.$supply(ppt_issue, ppt_level, ppt)}
                    {this.$expander(ppt_issue, ppt_level)}
                    {this.$claimed(ppt_issue, ppt_level)}
                    {this.$claimable(ppt_issue, ppt_level)}
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
            token={token}
            issue={ppt_issue}
            level={ppt_level}
            toggled={fixed || toggled}
            url_content={image.url_content}
            url_market={image.url_market}
            loading={image.loading}
            onLoaded={() => {
                if (this.props.onPptImageLoaded) {
                    this.props.onPptImageLoaded(
                        ppt_issue, ppt_level
                    );
                }
            }}
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
        const { toggled } = by_issue;
        return <UiPptExpander
            issue={ppt_issue}
            level={ppt_level}
            onToggled={(flag) => {
                if (this.props.onPptClaimerExpanded) {
                    const issues = Array.from(Years());
                    this.props.onPptClaimerExpanded(
                        issues, ppt_level, toggled
                    );
                }
                App.event.emit('toggle-issue', {
                    level: ppt_level, flag
                });
            }}
            toggled={toggled}
        />;
    }
    $claimed(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const { token } = this.props;
        const ppt_token = Nft.token(token);
        const by_level = this.state[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { claimed } = by_issue;
        return <UiPptClaimed
            issue={ppt_issue}
            level={ppt_level}
            value={claimed[ppt_token]}
            token={token}
        />;
    }
    $claimable(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const { token } = this.props;
        const ppt_token = Nft.token(token);
        const by_level = this.state[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { claimable } = by_issue;
        return <UiPptClaimable
            issue={ppt_issue}
            level={ppt_level}
            value={claimable[ppt_token]}
            token={token}
        />;
    }
    $claimer(
        ppt_issue: NftIssue, ppt_level: NftLevel, ppt_token: NftToken
    ) {
        const { token, details: matrix } = this.props;
        const { claimable, claimed } = this.state[ppt_level][ppt_issue];
        const { claimer, toggled } = matrix[ppt_level][ppt_issue];
        return <UiPptClaimer
            issue={ppt_issue}
            level={ppt_level}
            claimable={claimable[ppt_token]}
            claimed={claimed[ppt_token]}
            status={claimer.status}
            onClaim={
                this.props.onPptClaim?.bind(this)
            }
            onToggled={(flag, ctrl_key) => {
                const level = !ctrl_key ? ppt_level : undefined;
                App.event.emit('toggle-issue', { level, flag });
            }}
            toggled={toggled}
            token={token}
        />;
    }
    unPptChanged: Unsubscribe | undefined;
}
export default UiPptDetails;
