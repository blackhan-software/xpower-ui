import './list.scss';
import './amount';

import { App } from '../../../source/app';
import { buffered, delayed } from '../../../source/functions';
import { Amount, Supply, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel, NftLevels } from '../../../source/redux/types';
import { Tooltip } from '../../tooltips';

import React from 'react';
import { UiNftAmount } from './amount';
import { UiNftDetails, NftDetails } from '../details/details';

type Props = {
    list: NftList;
    onNftList?: (
        list: Partial<NftList>
    ) => void;
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
    toggled: boolean;
    token: Token;
}
export type NftList = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
    display: boolean; toggled: boolean;
}>;
export class UiNftList extends React.Component<
    Props
> {
    render() {
        const { token, list } = this.props;
        return <React.Fragment>
            <label className='form-label'>
                Mint & Manage {token} NFTs
            </label>
            {Array.from(NftLevels()).map((
                nft_level
            ) => {
                const by_token = App.getNftTotalBy({
                    token: Nft.token(token),
                    level: nft_level
                });
                const by_level = App.getNftTotalBy({
                    level: nft_level
                });
                return this.$nftMinter(
                    token, nft_level,
                    by_token, by_level,
                    list[nft_level]
                );
            })}
        </React.Fragment>;
    }
    $nftMinter(
        token: Token, nft_level: NftLevel,
        by_token: { amount: Amount, supply: Supply },
        by_level: { amount: Amount, supply: Supply },
        { amount, max, min, display, toggled }: NftList[NftLevel],
    ) {
        return <React.Fragment key={nft_level}>
            {this.$amount(token, nft_level, by_level, by_token, {
                amount, max, min, display, toggled
            })}
            {this.$details(token, nft_level, by_level, {
                amount, max, min, display, toggled
            })}
        </React.Fragment>;
    }
    $amount(
        token: Token, nft_level: NftLevel,
        by_level: { amount: Amount, supply: Supply },
        by_token: { amount: Amount, supply: Supply },
        { amount, max, min, display, toggled }: NftList[NftLevel],
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
            className='btn-group nft-minter'
            data-level={Nft.nameOf(nft_level)}
            style={style}
        >
            {this.$toggle(nft_level, toggled)}
            {this.$minter(nft_level, token)}
            {this.$balance(nft_level, by_token)}
            <UiNftAmount
                amount={amount}
                level={nft_level}
                max={max} min={min}
                onUpdate={({ amount }) => {
                    if (this.props.onNftList) {
                        this.props.onNftList({
                            [nft_level]: { amount }
                        });
                    }
                }} />
        </div>;
    }
    $details(
        token: Token, nft_level: NftLevel,
        by_level: { amount: Amount, supply: Supply },
        { amount, max, min, display, toggled }: NftList[NftLevel],
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
                data-level={Nft.nameOf(nft_level)}
                style={style}
            >
                <UiNftDetails
                    token={token}
                    level={nft_level}
                    details={
                        this.props.details
                    }
                    onNftImageLoaded={
                        this.props.onNftImageLoaded?.bind(this)
                    }
                    onNftSenderExpanded={
                        this.props.onNftSenderExpanded?.bind(this)
                    }
                    onNftTargetChanged={
                        this.props.onNftTargetChanged?.bind(this)
                    }
                    onNftAmountChanged={
                        this.props.onNftAmountChanged?.bind(this)
                    }
                    onNftTransfer={
                        this.props.onNftTransfer?.bind(this)
                    }
                />
            </div>;
        }
    }
    $toggle(
        nft_level: NftLevel, toggled: boolean
    ) {
        const title = toggled
            ? `Hide ${Nft.nameOf(nft_level)} NFTs [CTRL]`
            : `Show ${Nft.nameOf(nft_level)} NFTs [CTRL]`;
        return <div
            className='btn-group' role='group'
        >
            <button type='button'
                className='btn btn-outline-warning toggle no-ellipsis'
                data-bs-placement='top' data-bs-toggle='tooltip'
                data-state={toggled ? 'on' : 'off'}
                onClick={(e) => this.toggle(nft_level, toggled, e.ctrlKey)}
                title={title}
            >
                <i className={
                    toggled ? 'bi-chevron-up' : 'bi-chevron-down'
                } />
            </button>
        </div>;
    }
    toggle(
        nft_level: NftLevel, toggled: boolean, ctrl_key: boolean
    ) {
        const level = !ctrl_key ? nft_level : undefined
        App.event.emit('toggle-level', { level, flag: !toggled });
    }
    $minter(
        nft_level: NftLevel, token: Token
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
            title={title(nft_level, token)}
        >
            {head(nft_level)}<span
                className='d-none d-sm-inline'>{tail(nft_level)} NFTs</span>
        </button>;
    }
    $balance(
        nft_level: NftLevel, total_by: {
            amount: Amount, supply: Supply
        }
    ) {
        return <button type='button'
            className='btn btn-outline-warning balance'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`Overall personal balance & supply (${Nft.nameOf(nft_level)} NFTs)`}
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
            `.nft-minter .toggle`
        );
        $toggles.forEach(($toggle) => {
            Tooltip.getInstance($toggle)?.hide();
        });
        $toggles.forEach((delayed(($toggle: Element) => {
            Tooltip.getInstance($toggle)?.dispose();
            Tooltip.getOrCreateInstance($toggle);
        })));
    })
}
export default UiNftList;
