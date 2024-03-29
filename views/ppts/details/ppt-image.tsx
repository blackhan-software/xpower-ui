import React from 'react';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    toggled: boolean;
} & {
    url_content: string | null;
    url_market: string | null;
    loading: boolean;
} & {
    onLoaded?: () => void;
}
export function UiPptImage(
    props: Props
) {
    const { url_market } = props;
    return <div
        className='nft-image-wrap'
    >
        <a target='_blank' href={url_market ?? undefined}>
            {Spinner(props)}{$image(props)}
        </a>
    </div>;
}
function $image(
    props: Props
) {
    const { toggled, url_content, url_market } = props;
    const cursor = url_market ? 'pointer' : 'default';
    const display = url_content && toggled ? 'block' : 'none';
    return <img
        className='img-fluid nft-image'
        data-bs-placement='top'
        data-bs-toggle='tooltip'
        loading='lazy'
        onLoad={onLoaded.bind(null, props)}
        src={url_content ?? ''}
        style={{ cursor, display }}
        title={title(props)}
    />;
}
function onLoaded(
    props: Props
) {
    if (props.onLoaded) {
        props.onLoaded();
    }
}
function title(
    { level, issue }: Props
) {
    const rank = Nft.rankOf(level);
    const name = Nft.nameOf(level);
    const full_id = Nft.fullId({
        level, issue
    });
    return `Trade staked ${name} NFTs (level ${rank}/9 & ID #${Nft.realId(full_id)})`;
}
function Spinner(
    { loading }: Props
) {
    const style = {
        color: 'var(--xp-powered)',
        display: loading ? 'block' : 'none',
        zIndex: loading ? -1 : undefined
    };
    return <span
        className='spinner spinner-border'
        role='status' style={style}
    />;
}
export default UiPptImage;
