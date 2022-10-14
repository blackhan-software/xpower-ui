import { globalRef } from '../../../source/functions';
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
export function UiNftExpander(
    props: Props
) {
    useEffect(() => {
        if (props.expanded) {
            const core_id = Nft.coreId({
                issue: props.issue,
                level: props.level
            });
            const $row = globalRef<HTMLElement>(
                `:nft.row[core-id="${core_id}"]`
            );
            if ($row.current) {
                showTarget($row.current);
                showAmount($row.current);
                showSender($row.current);
            }
        }
    }, [props]);
    return $expander(props);
}
function $expander(
    props: Props
) {
    const classes = [
        'btn-group', 'nft-sender-expander',
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
            className='btn btn-outline-warning sender-expander'
            onClick={expand.bind(null, props)}
        >
            <i className='bi-chevron-down' />
        </button>
        <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            style={{ width: '43px' }}
            title='Show send to & amount'
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
function showTarget(
    $row: HTMLElement
) {
    const $target_label = $row.querySelector<HTMLElement>(
        '.nft-transfer-to-label'
    );
    const $target = $row.querySelector<HTMLElement>(
        '.nft-transfer-to'
    );
    $target_label?.classList.remove('d-none');
    $target?.classList.remove('d-none');
}
function showAmount(
    $row: HTMLElement
) {
    const $amount_label = $row.querySelector<HTMLElement>(
        '.nft-transfer-amount-label'
    );
    const $amount = $row.querySelector<HTMLElement>(
        '.nft-transfer-amount'
    );
    $amount_label?.classList.remove('d-none');
    $amount?.classList.remove('d-none');
}
function showSender(
    $row: HTMLElement
) {
    const $sender = $row.querySelector<HTMLElement>(
        '.nft-sender'
    );
    $sender?.classList.remove('d-none');
}
export default UiNftExpander;
