import { delayed, Referable } from '../../../source/functions';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';
import { Tooltip } from '../../tooltips';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    toggled: boolean;
    onToggle: (toggled: boolean) => void;
}
export class PptExpander extends Referable(React.Component)<
    Props
> {
    render() {
        const { issue, level, toggled } = this.props;
        return this.$expander(issue, level, toggled);
    }
    $expander(
        nft_issue: NftIssue, nft_level: NftLevel, toggled: boolean
    ) {
        return <React.Fragment>
            <div className='btn-group nft-claimer-expander d-sm-none'
                data-level={Nft.nameOf(nft_level)} role='group'
                style={{ marginTop: '1em', width: '100%' }}
            >
                <button type='button'
                    className='btn btn-outline-warning toggle-old no-ellipsis'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    data-state={toggled ? 'on' : 'off'}
                    onClick={this.toggle.bind(this, toggled)}
                    title={this.title(toggled)}
                >
                    <i className={
                        toggled ? 'bi-eye-slash-fill' : 'bi-eye-fill'
                    } />
                </button>
                <button type='button'
                    className='btn btn-outline-warning claimer-expander'
                    onClick={this.expand.bind(this, nft_issue, nft_level)}
                >
                    <i className='bi-chevron-down' />
                </button>
                <button type='button'
                    className='btn btn-outline-warning info'
                    data-bs-placement='top' data-bs-toggle='tooltip'
                    style={{ width: '43px' }}
                    title='Show claimed & claimable'
                >
                    <InfoCircle fill={true} />
                </button>
            </div>
        </React.Fragment>;
    }
    title(
        toggled: boolean
    ) {
        return toggled
            ? 'Hide older NFTs'
            : 'Show older NFTs';
    }
    toggle(
        toggled: boolean
    ) {
        this.props.onToggle(toggled);
    }
    expand(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const id = Nft.coreId({
            issue: nft_issue, level: nft_level
        });
        const $row = this.global_ref<HTMLElement>(
            `ppt:${id}`
        );
        if ($row.current) {
            this.hideExpander($row.current);
            this.showClaimed($row.current);
            this.showClaimable($row.current);
            this.showClaimer($row.current);
        }
    }
    hideExpander(
        $row: HTMLElement
    ) {
        const $expander = $row.querySelector<HTMLElement>(
            '.nft-claimer-expander'
        );
        if ($expander) {
            $expander.hidden = true;
        }
    }
    showClaimed(
        $row: HTMLElement
    ) {
        const $target_label = $row.querySelector<HTMLElement>(
            '.nft-claimed-label'
        );
        const $target = $row.querySelector<HTMLElement>(
            '.nft-claimed'
        );
        $target_label?.classList.remove('d-none');
        $target?.classList.remove('d-none');
    }
    showClaimable(
        $row: HTMLElement
    ) {
        const $amount_label = $row.querySelector<HTMLElement>(
            '.nft-claimable-label'
        );
        const $amount = $row.querySelector<HTMLElement>(
            '.nft-claimable'
        );
        $amount_label?.classList.remove('d-none');
        $amount?.classList.remove('d-none');
    }
    showClaimer(
        $row: HTMLElement
    ) {
        const $claimer = $row.querySelector<HTMLElement>(
            '.nft-claimer'
        );
        $claimer?.classList.remove('d-none');
    }
    componentDidUpdate() {
        const $toggles = document.querySelectorAll<HTMLElement>(
            '.toggle-old'
        );
        $toggles.forEach(delayed(($el: HTMLElement) => {
            Tooltip.getInstance($el)?.dispose();
            Tooltip.getOrCreateInstance($el);
        }));
    }
}
export default PptExpander;
