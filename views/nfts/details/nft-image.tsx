import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Referable } from '../../../source/functions';
import { Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';
import { NftWallet, NftWalletMock } from '../../../source/wallet';
import { NftImageMeta } from './nft-image-meta';

import React from 'react';

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
export class UiNftImage extends Referable(React.Component)<
    Props
> {
    render() {
        const { url_market, loading } = this.props;
        const { level, issue } = this.props;
        return <div
            className='nft-image-wrap'
        >
            <a target='_blank' href={url_market ?? ''}>
                {Spinner({ loading })}
                {this.$image(level, issue)}
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
        return <img ref={this.ref('img')}
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
    componentDidMount() {
        App.event.emit('refresh-tips');
    }
}
function Spinner(
    { loading }: { loading: boolean }
) {
    const style = {
        color: 'var(--xp-powered)',
        display: loading ? 'block' : 'none',
        filter: 'invert(0)',
        zIndex: loading ? -1 : undefined
    };
    return <span
        className='spinner spinner-border'
        role='status' style={style}
    />;
}
export async function nft_meta({ level, issue, token }: {
    level: NftLevel, issue: NftIssue, token: Token
}) {
    const address = await Blockchain.selectedAddress;
    const avalanche = await Blockchain.isAvalanche();
    return address && avalanche
        ? await NftImageMeta.get(address, { level, issue, token })
        : await NftImageMeta.get(undefined, { level, issue, token });
}
export async function nft_href({ level, issue, token }: {
    level: NftLevel, issue: NftIssue, token: Token
}) {
    const address = await Blockchain.selectedAddress;
    const avalanche = await Blockchain.isAvalanche();
    const nft_wallet = address && avalanche
        ? new NftWallet(address, token)
        : new NftWalletMock(0n, token);
    const nft_id = Nft.coreId({ level, issue });
    const supply = await nft_wallet.totalSupply(nft_id);
    if (supply > 0) {
        const nft_contract = await nft_wallet.contract;
        const market = 'https://nftrade.com/assets/avalanche';
        return new URL(`${market}/${nft_contract.address}/${nft_id}`);
    }
    return null;
}
export default UiNftImage;
