import { Bus } from '../../../source/bus';
import { Referable } from '../../../source/functions';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    expanded: boolean | null;
    onExpanded?: (expanded: boolean) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export class UiPptExpander extends Referable(
    React.Component<Props>
) {
    render() {
        const { expanded, toggled } = this.props;
        return this.$expander(expanded, toggled);
    }
    $expander(
        expanded: boolean | null, toggled: boolean
    ) {
        const classes = [
            'btn-group', 'nft-claimer-expander',
            expanded ? 'd-none' : 'd-sm-none'
        ];
        return <div
            className={classes.join(' ')} role='group'
            style={{ marginTop: '1em', width: '100%' }}
        >
            <button type='button'
                className='btn btn-outline-warning toggle-old no-ellipsis'
                data-bs-placement='top' data-bs-toggle='tooltip'
                onClick={this.toggle.bind(this, toggled)}
                title={this.title(toggled)}
            >
                <i className={
                    toggled ? 'bi-eye-slash-fill' : 'bi-eye-fill'
                } />
            </button>
            <button type='button'
                className='btn btn-outline-warning claimer-expander'
                onClick={this.expand.bind(this)}
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
        </div>;
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
        if (this.props.onToggled) {
            this.props.onToggled(!toggled);
        }
    }
    expand() {
        if (this.props.onExpanded) {
            this.props.onExpanded(true);
        }
    }
    componentDidUpdate() {
        if (this.props.expanded) {
            const core_id = Nft.coreId({
                issue: this.props.issue,
                level: this.props.level
            });
            const $row = this.globalRef<HTMLElement>(
                `:ppt.row[core-id="${core_id}"]`
            );
            if ($row.current) {
                this.showClaimed($row.current);
                this.showClaimable($row.current);
                this.showClaimer($row.current);
            }
        }
        Bus.emit('refresh-tips');
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
}
export default UiPptExpander;
