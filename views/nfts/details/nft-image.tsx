import React from 'react';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';
import { A, Div, Img, Span } from '../../../source/react';

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
export function UiNftImage(
    props: Props
) {
    const { url_market } = props;
    return <Div className='nft-image-wrap'>
        <A target='_blank' href={url_market ?? undefined}>
            {Spinner(props)}{$image(props)}
        </A>
    </Div>;
}
function $image(
    props: Props
) {
    const { toggled, url_content, url_market } = props;
    const cursor = url_market ? 'pointer' : 'default';
    const display = url_content && toggled ? 'block' : 'none';
    return <Img
        className='img-fluid nft-image'
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
    return <Span
        className='spinner spinner-border'
        role='status' style={style}
    />;
}
export default UiNftImage;
