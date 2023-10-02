import { globalRef } from '../../../source/react';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';

import React, { useEffect } from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    expanded: boolean | null;
    onExpanded?: (expanded: boolean) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export function UiPptExpander(
    props: Props
) {
    useEffect(() => {
        if (props.expanded) {
            const full_id = Nft.fullId({
                issue: props.issue,
                level: props.level
            });
            const $row = globalRef<HTMLElement>(
                `:ppt.row[full-id="${full_id}"]`
            );
            if ($row.current) {
                showClaimed($row.current);
                showClaimable($row.current);
                showClaimer($row.current);
            }
        }
    }, [props]);
    return $expander(props);
}
function $expander(
    props: Props
) {
    const classes = [
        'btn-group', 'nft-claimer-expander',
        props.expanded ? 'd-none' : 'd-sm-none'
    ];
    return <div
        className={classes.join(' ')} role='group'
        style={{ marginTop: '1em', width: '100%' }}
    >
        <button type='button'
            className='btn btn-outline-warning toggle-old no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            onClick={toggle.bind(null, props)}
            title={title(props)}
        >
            <i className={
                props.toggled ? 'bi-eye-slash-fill' : 'bi-eye-fill'
            } />
        </button>
        <button type='button'
            className='btn btn-outline-warning claimer-expander'
            onClick={expand.bind(null, props)}
        >
            <i className='bi-chevron-down' />
        </button>
        <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            style={{ width: '43px' }}
            title='Show minted & mintable'
        >
            <InfoCircle fill={true} />
        </button>
    </div>;
}
function title(
    { toggled }: Props
) {
    return toggled
        ? 'Hide older NFTs'
        : 'Show older NFTs';
}
function toggle(
    { toggled, onToggled }: Props
) {
    if (onToggled) {
        onToggled(!toggled);
    }
}
function expand(
    { onExpanded }: Props
) {
    if (onExpanded) {
        onExpanded(true);
    }
}
function showClaimed(
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
function showClaimable(
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
function showClaimer(
    $row: HTMLElement
) {
    const $claimer = $row.querySelector<HTMLElement>(
        '.nft-claimer'
    );
    $claimer?.classList.remove('d-none');
}
export default UiPptExpander;
