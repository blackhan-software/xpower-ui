import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { MoeTreasuryFactory } from '../../../source/contract';
import { delayed, Referable, update, x40 } from '../../../source/functions';
import { Amount, Supply, Token } from '../../../source/redux/types';
import { NftToken, NftTokens } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { Nft, NftFullId, NftIssue } from '../../../source/redux/types';
import { Years } from '../../../source/years';

import React from 'react';
import { PptImage } from './ppt-image';
import { PptClaimable } from './ppt-claimable';
import { PptClaimed } from './ppt-claimed';
import { PptClaimer } from './ppt-claimer';
import { PptExpander } from './ppt-expander';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
    level: NftLevel;
}
type State = Record<NftLevel, Record<NftIssue, {
    claimable: Record<NftToken, Amount>;
    claimed: Record<NftToken, Amount>;
    fixed: boolean;
    toggled: boolean;
}>>
function state() {
    const tokens = Array.from(NftTokens());
    const issues = Array.from(Years()).reverse();
    const levels = Array.from(NftLevels());
    const state = Object.fromEntries(
        levels.map((level) => [level, Object.fromEntries(
            issues.map((issue) => [issue, {
                claimed: Object.assign({}, ...tokens.map((t) => ({
                    [t]: 0n
                }))),
                claimable: Object.assign({}, ...tokens.map((t) => ({
                    [t]: 0n
                }))),
                fixed: issues[0] - issue ? false : true,
                toggled: false
            }])
        )])
    );
    return state as State;
}
export class PptDetails extends Referable(React.Component)<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = state();
        this.events();
    }
    async events() {
        App.onPptChanged(async/*reset-claims*/(
            full_id: NftFullId
        ) => {
            const nft_token = Nft.token(full_id);
            if (nft_token !== Nft.token(
                this.props.token
            )) {
                return;
            }
            const nft_level = Nft.level(full_id);
            if (nft_level !== this.props.level) {
                return;
            }
            const nft_issue = Nft.issue(full_id);
            if (nft_issue === 0) {
                return;
            }
            reset(nft_token, nft_level, nft_issue);
        });
        Array.from(Years()).forEach(delayed((
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
                const nft_token = Nft.token(token);
                reset(nft_token, level, issue);
            });
            const { token, level } = this.props;
            const nft_token = Nft.token(token);
            reset(nft_token, level, issue);
        }));
        const reset = async (
            nft_token: NftToken,
            nft_level: NftLevel,
            nft_issue: NftIssue
        ) => {
            const address = await Blockchain.selectedAddress;
            if (!address) {
                throw new Error('missing selected-address');
            }
            const core_id = Nft.coreId({
                issue: nft_issue, level: nft_level
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
            update<State>.bind(this)({
                [nft_level]: {
                    [nft_issue]: {
                        claimable: {
                            [nft_token]: claimable.toBigInt()
                        },
                        claimed: {
                            [nft_token]: claimed.toBigInt()
                        }
                    }
                }
            });
        };
        App.event.on('toggle-issue', ({
            level, issue, flag
        }) => {
            const levels = level !== undefined
                ? [level] : Array.from(NftLevels());
            const issues = issue !== undefined
                ? [issue] : Array.from(Years());
            const state = Object.fromEntries(
                levels.map((l) => [
                    l, Object.fromEntries(
                        issues.map((i) => [
                            i, { toggled: !flag }
                        ])
                    )
                ])
            );
            update<State>.bind(this)(state);
        });
    }
    render() {
        const years = Array.from(Years()).reverse();
        return <React.Fragment>{
            years.map((year) => this.$row(
                year, this.props.level
            ))
        }</React.Fragment>;
    }
    $row(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const by_level = this.state[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { fixed, toggled } = by_issue;
        const nft_token = Nft.token(
            this.props.token
        );
        const core_id = Nft.coreId({
            issue: ppt_issue,
            level: ppt_level
        });
        const full_id = Nft.fullId({
            issue: ppt_issue,
            level: ppt_level,
            token: nft_token
        });
        const ppts = App.getPpts({
            issue: ppt_issue,
            level: ppt_level,
            token: nft_token
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
                    {this.$claimer(ppt_issue, ppt_level)}
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
        const by_level = this.state[ppt_level];
        const by_issue = by_level[ppt_issue];
        const { fixed, toggled } = by_issue;
        const { token } = this.props;
        return <PptImage
            token={token}
            level={ppt_level}
            issue={ppt_issue}
            toggled={fixed || toggled}
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
                    title={`Personal balance of ${Nft.nameOf(nft_level)} NFTs staked (for ${nft_issue})`}
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
                    title={`Total supply of ${Nft.nameOf(nft_level)} NFTs staked so far (for ${nft_issue})`}
                >
                    <InfoCircle fill={true} />
                </span>
            </div>
        </React.Fragment>;
    }
    $expander(
        nft_issue: NftIssue, nft_level: NftLevel,
    ) {
        const by_level = this.state[nft_level];
        const by_issue = by_level[nft_issue];
        const { toggled } = by_issue;
        return <PptExpander
            issue={nft_issue}
            level={nft_level}
            onToggle={(flag) => {
                const issues = Array.from(Years());
                update<State>.bind(this)({
                    [nft_level]: Object.fromEntries(
                        issues.map((issue) => [issue, {
                            toggled: !flag
                        }])
                    )
                });
            }}
            toggled={toggled}
        />;
    }
    $claimed(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const { token } = this.props;
        const nft_token = Nft.token(token);
        const by_level = this.state[nft_level];
        const by_issue = by_level[nft_issue];
        const { claimed } = by_issue;
        return <PptClaimed
            issue={nft_issue}
            level={nft_level}
            value={claimed[nft_token]}
            token={token}
        />;
    }
    $claimable(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const { token } = this.props;
        const nft_token = Nft.token(token);
        const by_level = this.state[nft_level];
        const by_issue = by_level[nft_issue];
        const { claimable } = by_issue;
        return <PptClaimable
            issue={nft_issue}
            level={nft_level}
            value={claimable[nft_token]}
            token={token}
        />;
    }
    $claimer(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const { token } = this.props;
        const nft_token = Nft.token(token);
        const by_level = this.state[nft_level];
        const by_issue = by_level[nft_issue];
        const { claimable, claimed } = by_issue;
        const { toggled } = by_issue;
        return <PptClaimer
            token={token}
            issue={nft_issue}
            level={nft_level}
            claimable={claimable[nft_token]}
            onClaimed={(
                from, full_id, amount
            ) => {
                update<State>.bind(this)({
                    [nft_level]: {
                        [nft_issue]: {
                            claimable: {
                                [nft_token]: 0n
                            },
                            claimed: {
                                [nft_token]: claimed[nft_token] + amount
                            }
                        }
                    }
                });
            }}
            onToggle={(flag) => {
                App.event.emit('toggle-issue', {
                    level: nft_level, flag
                });
            }}
            toggled={toggled}
        />;
    }
    componentDidMount = () => {
        App.event.emit('refresh-tips');
    }
}
export default PptDetails;
