import { Bus } from '../../../source/bus';
import { MoeTreasuryFactory } from '../../../source/contract';
import { nice, x40 } from '../../../source/functions';
import { AddressContext, globalRef } from '../../../source/react';
import { onPptChanged } from '../../../source/redux/observers';
import { AppState } from '../../../source/redux/store';
import { Address, Amount, Nft, NftFullId, NftIssue, NftLevel, NftLevels, Nfts, NftToken, NftTokens, PptDetails, Supply, Token } from '../../../source/redux/types';
import { Years } from '../../../source/years';

import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
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
function initialState(
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
export function UiPptDetails(
    props: Props
) {
    const [state, set_state] = useState(initialState());
    const [address] = useContext(AddressContext);
    const { token, level: ppt_level } = props;
    useEffect(/*init*/() => {
        const ppt_token = Nft.token(token);
        Array.from(Years()).forEach(async (
            ppt_issue: NftIssue
        ) => {
            const patch = await claims(address, token)(
                ppt_token, ppt_level, ppt_issue
            );
            set_state((s) => $.extend(true, {}, s, patch));
        });
    }, [
        address, token, ppt_level
    ]);
    useEffect(/*sync[on:refresh-claims]*/() => {
        const ppt_token = Nft.token(token);
        Array.from(Years()).forEach(async (
            ppt_issue: NftIssue
        ) => {
            const core_id = Nft.coreId({
                level: ppt_level, issue: ppt_issue
            });
            const ref = globalRef<HTMLElement>(
                `:ppt.row[core-id="${core_id}"]`
            );
            if (ref.current) {
                on_refresh(ref.current, async () => {
                    const patch = await claims(address, token)(
                        ppt_token, ppt_level, ppt_issue
                    );
                    set_state((s) => $.extend(true, {}, s, patch));
                });
            }
        });
        function on_refresh(
            $element: HTMLElement, listener: () => void
        ) {
            const $el = $element as HTMLElement & {
                onrefresh?: typeof listener
            };
            if ($el.onrefresh) {
                $el.removeEventListener('refresh-claims', $el.onrefresh);
            }
            $el.addEventListener('refresh-claims', listener);
            $el.onrefresh = listener;
        }
    }, [
        address, token, ppt_level
    ]);
    const store = useStore<AppState>();
    useEffect(/*sync[on:ppt-changed]*/() => {
        const ppt_token = Nft.token(token);
        return onPptChanged(store, async (
            full_id: NftFullId
        ) => {
            if (Nft.token(full_id) !== ppt_token) {
                return;
            }
            if (Nft.level(full_id) !== ppt_level) {
                return;
            }
            const patch = await claims(address, token)(
                ppt_token, ppt_level, Nft.issue(full_id)
            );
            set_state((s) => $.extend(true, {}, s, patch));
        });
    }, [
        address, token, ppt_level, store
    ]);
    const issues = Array.from(Years({ reverse: true }));
    return <React.Fragment>{
        issues.map((issue) => $row(props, issue, { state }))
    }</React.Fragment>;
}
function claims(
    address: Address | null, token: Token
) {
    if (!address) {
        throw new Error('missing selected-address');
    }
    return async (
        ppt_token: NftToken,
        ppt_level: NftLevel,
        ppt_issue: NftIssue
    ) => {
        const core_id = Nft.coreId({
            level: ppt_level, issue: ppt_issue
        });
        const moe_treasury = MoeTreasuryFactory({ token });
        const [claimed, claimable] = await Promise.all([
            await moe_treasury.then(
                (c) => c.claimedFor(x40(address), core_id)
            ),
            await moe_treasury.then(
                (c) => c.claimableFor(x40(address), core_id)
            )
        ]);
        return {
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
        };
    };
}
function $row(
    props: Props, ppt_issue: NftIssue,
    { state }: { state: State }
) {
    const { details, level: ppt_level, ppts, token } = props;
    const by_level = details[ppt_level];
    const by_issue = by_level[ppt_issue];
    const { fixed, toggled } = by_issue;
    const ppt_token = Nft.token(token);
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
            ref={globalRef(`:ppt.row[core-id="${core_id}"]`)}
            style={{ display: fixed || toggled ? 'flex' : 'none' }}
        >
            <div className='col-sm nft-details-lhs'>
                {$image(props, ppt_issue)}
            </div>
            <div className='col-sm nft-details-rhs'>
                {$issue(props, ppt_issue)}
                {$balance(props, ppt_issue, ppt)}
                {$supply(props, ppt_issue, ppt)}
                {$expander(props, ppt_issue)}
                {$claimed(props, ppt_issue, { state })}
                {$claimable(props, ppt_issue, { state })}
                {$claimer(props, ppt_issue, { state })}
            </div>
        </div>
        <hr className='year' style={{
            display: fixed || toggled ? 'block' : 'none'
        }} />
    </React.Fragment>;
}
function $image(
    props: Props, ppt_issue: NftIssue
) {
    const { details, level: ppt_level } = props;
    const by_level = details[ppt_level];
    const by_issue = by_level[ppt_issue];
    const { image, fixed, toggled } = by_issue;
    const { token } = props;
    return <UiPptImage
        issue={ppt_issue}
        level={ppt_level}
        loading={image.loading}
        onLoaded={() => {
            if (props.onPptImageLoaded) {
                props.onPptImageLoaded(
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
function $issue(
    props: Props, ppt_issue: NftIssue
) {
    const { level: ppt_level } = props;
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
function $balance(
    props: Props, ppt_issue: NftIssue,
    { amount: balance }: { amount: Amount }
) {
    const { level: ppt_level } = props;
    return <React.Fragment>
        <label className='form-label'>
            Personal Balance
        </label>
        <div className='input-group nft-balance'>
            <input className='form-control' readOnly
                type='text' value={nice(balance)}
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
function $supply(
    props: Props, ppt_issue: NftIssue,
    { supply }: { supply: Supply }
) {
    const { level: ppt_level } = props;
    return <React.Fragment>
        <label className='form-label'>
            Total Supply
        </label>
        <div className='input-group nft-total-supply'>
            <input className='form-control' readOnly
                type='text' value={nice(supply)}
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
function $expander(
    props: Props, ppt_issue: NftIssue
) {
    const { details, level: ppt_level } = props;
    const by_level = details[ppt_level];
    const by_issue = by_level[ppt_issue];
    const { expanded, toggled } = by_issue;
    return <UiPptExpander
        issue={ppt_issue}
        level={ppt_level}
        onExpanded={((expanded) => {
            if (props.onPptClaimerExpanded) {
                props.onPptClaimerExpanded(
                    ppt_issue, ppt_level, expanded
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
function $claimed(
    props: Props, ppt_issue: NftIssue,
    { state }: { state: State }
) {
    const { level: ppt_level, token } = props;
    const by_level = state[ppt_level];
    const by_issue = by_level[ppt_issue];
    const { claimed } = by_issue;
    return <UiPptClaimed
        issue={ppt_issue}
        token={token}
        value={claimed[Nft.token(token)]}
    />;
}
function $claimable(
    props: Props, ppt_issue: NftIssue,
    { state }: { state: State }
) {
    const { level: ppt_level, token } = props;
    const by_level = state[ppt_level];
    const by_issue = by_level[ppt_issue];
    const { claimable } = by_issue;
    return <UiPptClaimable
        issue={ppt_issue}
        token={token}
        value={claimable[Nft.token(token)]}
    />;
}
function $claimer(
    props: Props, ppt_issue: NftIssue,
    { state }: { state: State }
) {
    const { details, level: ppt_level, token } = props;
    const { claimer, toggled } = details[ppt_level][ppt_issue];
    const { claimable, claimed } = state[ppt_level][ppt_issue];
    return <UiPptClaimer
        issue={ppt_issue}
        level={ppt_level}
        claimable={claimable[Nft.token(token)]}
        claimed={claimed[Nft.token(token)]}
        onClaim={props.onPptClaim}
        onToggled={(flag) => {
            Bus.emit('toggle-issue', { flag });
        }}
        status={claimer.status}
        toggled={toggled}
        token={token}
    />;
}
export default UiPptDetails;
