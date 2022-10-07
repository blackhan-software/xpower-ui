import React from 'react';
import { Nft, NftIssue, NftLevel, Token } from '../../../source/redux/types';

type Props = {
    token: Token;
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
export class UiPptImage extends React.Component<
    Props
> {
    render() {
        const { url_market, loading } = this.props;
        const { level, issue } = this.props;
        return <div
            className='nft-image-wrap'
        >
            <a target='_blank' href={url_market ?? undefined}>
                {Spinner({ loading })}{this.$image(level, issue)}
            </a>
        </div>;
    }
    $image(
        level: NftLevel, issue: NftIssue
    ) {
        const { url_content } = this.props;
        const { url_market } = this.props;
        const { toggled } = this.props;
        const cursor = url_market ? 'pointer' : 'default';
        const display = url_content && toggled ? 'block' : 'none';
        const title = this.title(level, issue);
        return <img
            className='img-fluid nft-image'
            data-bs-placement='top'
            data-bs-toggle='tooltip'
            loading='lazy'
            onLoad={this.onLoaded.bind(this)}
            src={url_content ?? ''}
            style={{ cursor, display }}
            title={title}
        />;
    }
    onLoaded() {
        if (this.props.onLoaded) {
            this.props.onLoaded();
        }
        this.setState({ loading: false })
    }
    title(
        level: NftLevel, issue: NftIssue
    ) {
        const rank = Nft.rankOf(level);
        const name = Nft.nameOf(level);
        const id = Nft.coreId({ level, issue });
        return `Trade staked ${name} NFTs (level ${rank}/9 & ID #${id})`;
    }
}
function Spinner(
    { loading }: { loading: boolean }
) {
    const style = {
        color: 'var(--xp-powered)',
        display: loading ? 'block' : 'none',
        filter: 'invert(1)',
        zIndex: loading ? -1 : undefined
    };
    return <span
        className='spinner spinner-border'
        role='status' style={style}
    />;
}
export default UiPptImage;
