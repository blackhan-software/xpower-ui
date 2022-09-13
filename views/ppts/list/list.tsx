import './list.scss';
import './amount';

import { App } from '../../../source/app';
import { buffered, delayed } from '../../../source/functions';
import { Amount, Supply, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel, NftLevels } from '../../../source/redux/types';
import { Tooltip } from '../../tooltips';

import React from 'react';
import { UiPptAmount } from './amount';
import { UiPptDetails, PptDetails } from '../details/details';

type Props = {
    list: PptList;
    onPptList?: (
        list: Partial<PptList>
    ) => void;
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
    toggled: boolean;
    token: Token;
}
type PptList = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
    display: boolean; toggled: boolean;
}>;
export class UiPptList extends React.Component<
    Props
> {
    render() {
        const { token, list } = this.props;
        return <React.Fragment>
            <label className='form-label'>
                Stake & Manage {token} NFTs
            </label>
            {Array.from(NftLevels()).map((
                nft_level
            ) => {
                const by_token = App.getPptTotalBy({
                    token: Nft.token(token),
                    level: nft_level
                });
                const by_level = App.getPptTotalBy({
                    level: nft_level
                });
                return this.$pptMinter(
                    token, nft_level,
                    by_token, by_level,
                    list[nft_level]
                );
            })}
        </React.Fragment>;
    }
    $pptMinter(
        token: Token, ppt_level: NftLevel,
        by_token: { amount: Amount, supply: Supply },
        by_level: { amount: Amount, supply: Supply },
        { amount, max, min, display, toggled }: PptList[NftLevel],
    ) {
        return <React.Fragment key={ppt_level}>
            {this.$amount(token, ppt_level, by_level, by_token, {
                amount, max, min, display, toggled
            })}
            {this.$details(token, ppt_level, by_level, {
                amount, max, min, display, toggled
            })}
        </React.Fragment>;
    }
    $amount(
        token: Token, ppt_level: NftLevel,
        by_level: { amount: Amount, supply: Supply },
        by_token: { amount: Amount, supply: Supply },
        { amount, max, min, display, toggled }: PptList[NftLevel],
    ) {
        const any_filter = [
            by_level.supply, by_level.amount, amount, max, min,
            this.props.toggled // toggles *all* levels!
        ];
        const style = {
            display: (display || any_filter.some((v) => v))
                ? 'inline-flex' : 'none',
        };
        return <div role='group'
            className='btn-group ppt-minter'
            data-level={Nft.nameOf(ppt_level)}
            style={style}
        >
            {this.$toggle(ppt_level, toggled)}
            {this.$minter(ppt_level, token)}
            {this.$balance(ppt_level, by_token)}
            <UiPptAmount
                amount={amount}
                level={ppt_level}
                max={max} min={min}
                onUpdate={({ amount }) => {
                    if (this.props.onPptList) {
                        this.props.onPptList({
                            [ppt_level]: { amount }
                        });
                    }
                }} />
        </div>;
    }
    $details(
        token: Token, ppt_level: NftLevel,
        by_level: { amount: Amount, supply: Supply },
        { amount, max, min, display, toggled }: PptList[NftLevel],
    ) {
        const any_filter = [
            by_level.supply, by_level.amount, amount, max, min,
            this.props.toggled // toggles *all* levels!
        ];
        const style = {
            display: (display || any_filter.some((v) => v)) && toggled
                ? 'block' : 'none'
        };
        if (style.display === 'block') {
            return <div role='group'
                className='nft-details'
                data-level={Nft.nameOf(ppt_level)}
                style={style}
            >
                <UiPptDetails
                    token={token}
                    level={ppt_level}
                    details={
                        this.props.details
                    }
                    onPptImageLoaded={
                        this.props.onPptImageLoaded?.bind(this)
                    }
                    onPptClaimerExpanded={
                        this.props.onPptClaimerExpanded?.bind(this)
                    }
                    onPptTargetChanged={
                        this.props.onPptTargetChanged?.bind(this)
                    }
                    onPptAmountChanged={
                        this.props.onPptAmountChanged?.bind(this)
                    }
                    onPptTransfer={
                        this.props.onPptTransfer?.bind(this)
                    }
                    onPptClaim={
                        this.props.onPptClaim?.bind(this)
                    }
                />
            </div>;
        }
    }
    $toggle(
        ppt_level: NftLevel, toggled: boolean
    ) {
        const title = toggled
            ? `Hide ${Nft.nameOf(ppt_level)} NFTs [CTRL]`
            : `Show ${Nft.nameOf(ppt_level)} NFTs [CTRL]`;
        return <div
            className='btn-group' role='group'
        >
            <button type='button'
                className='btn btn-outline-warning toggle no-ellipsis'
                data-bs-placement='top' data-bs-toggle='tooltip'
                data-state={toggled ? 'on' : 'off'}
                onClick={(e) => this.toggle(ppt_level, toggled, e.ctrlKey)}
                title={title}
            >
                <i className={
                    toggled ? 'bi-chevron-up' : 'bi-chevron-down'
                } />
            </button>
        </div>;
    }
    toggle(
        ppt_level: NftLevel, toggled: boolean, ctrl_key: boolean
    ) {
        const level = !ctrl_key ? ppt_level : undefined
        App.event.emit('toggle-level', { level, flag: !toggled });
    }
    $minter(
        ppt_level: NftLevel, token: Token
    ) {
        const head = (nft_level: NftLevel) => {
            const nft_name = Nft.nameOf(nft_level);
            if (nft_name) return nft_name.slice(0, 1);
        };
        const tail = (nft_level: NftLevel) => {
            const nft_name = Nft.nameOf(nft_level);
            if (nft_name) return nft_name.slice(1);
        };
        const title = (
            nft_level: NftLevel, token: Token
        ) => {
            const nft_name = Nft.nameOf(nft_level);
            const lhs_head = head(nft_level);
            const lhs = lhs_head ? `1${lhs_head}` : '';
            const rhs_head = head(nft_level + 3);
            const rhs = rhs_head ? `1${rhs_head}` : `K${lhs_head}`;
            return `Mint ${nft_name} NFTs (for [${lhs}...${rhs}] ${token} tokens)`;
        };
        return <button type='button'
            className='btn btn-outline-warning minter'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={title(ppt_level, token)}
        >
            {head(ppt_level)}<span
                className='d-none d-sm-inline'>{tail(ppt_level)} NFTs</span>
        </button>;
    }
    $balance(
        ppt_level: NftLevel, total_by: {
            amount: Amount, supply: Supply
        }
    ) {
        return <button type='button'
            className='btn btn-outline-warning balance'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`Overall personal balance & supply (${Nft.nameOf(ppt_level)} NFTs)`}
        >
            <span>{
                total_by.amount.toString()
            }</span>
            <span className='d-none d-sm-inline'>
                &nbsp;/&nbsp;
            </span>
            <span className='d-none d-sm-inline'>{
                total_by.supply.toString()
            }</span>
        </button>;
    }
    componentDidUpdate = buffered(() => {
        const $toggles = document.querySelectorAll(
            `.ppt-minter .toggle`
        );
        $toggles.forEach(($toggle) => {
            Tooltip.getInstance($toggle)?.hide();
        });
        $toggles.forEach(delayed(($toggle: Element) => {
            Tooltip.getInstance($toggle)?.dispose();
            Tooltip.getOrCreateInstance($toggle);
        }));
    })
}
export default UiPptList;
