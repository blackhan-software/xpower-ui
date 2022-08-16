import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Referable, buffered } from '../../../source/functions';
import { Page, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';
import { PptWallet } from '../../../source/wallet';
import { PptImageMeta } from './ppt-image-meta';
import { Tooltip } from '../../tooltips';

import React from 'react';

type Props = {
    token: Token,
    issue: NftIssue,
    level: NftLevel,
    toggled: boolean
}
type State = {
    href?: string,
    image: string,
    loading: boolean
}
function state() {
    return { image: '', loading: false };
}
export class PptImage extends Referable(React.Component)<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = state();
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => {
            reset({ ...this.props, token });
        });
        const reset = ({ level, issue, token }: Props) => {
            this.setState({ image: '', loading: true }, () => {
                meta(level, issue, token).then(({ image }) => {
                    this.setState({ image });
                });
            });
            this.setState({ href: undefined }, () => {
                href(level, issue, token).then((href) => {
                    if (href) this.setState({
                        href: href.toString()
                    });
                });
            });
        };
        App.onPageSwitch((page) => {
            if (page === Page.Staking) {
                init(this.props);
            }
        });
        const init = ({ level, issue, token }: Props) => {
            meta(level, issue, token).then(({ image }) => {
                this.setState({ image, loading: true });
            });
            href(level, issue, token).then((href) => {
                if (href) this.setState({
                    href: href.toString()
                });
            });
        };
        /**
         * @todo: decouple from App.page!
         */
        if (App.page === Page.Staking) {
            init(this.props);
        }
    }
    render() {
        const { level, issue } = this.props;
        const { href, loading } = this.state;
        return <div
            className='nft-image-wrap'
        >
            <a target='_blank' href={href}>
                {this.$spinner(loading)}
                {this.$image(level, issue)}
            </a>
        </div>;
    }
    $spinner(
        loading: boolean
    ) {
        return <span
            className='spinner spinner-border'
            role='status' style={{
                color: 'var(--xp-powered)',
                display: loading ? 'block' : 'none',
                zIndex: loading ? -1 : undefined,
                filter: 'invert(1)'
            }}
        />;
    }
    $image(
        ppt_level: NftLevel, ppt_issue: NftIssue
    ) {
        const { toggled } = this.props;
        const { href, image } = this.state;
        const id = Nft.coreId({
            level: ppt_level, issue: ppt_issue
        });
        const cursor = href ? 'pointer' : 'default';
        const display = image && toggled ? 'block' : 'none';
        const title = this.title(ppt_level, ppt_issue);
        return <img ref={this.ref('img')}
            className='img-fluid nft-image'
            data-bs-placement='top'
            data-bs-toggle='tooltip'
            data-id={id}
            loading='lazy'
            onLoad={this.onLoad.bind(this)}
            src={image}
            style={{ cursor, display }}
            title={title}
        />;
    }
    onLoad() {
        this.setState({ loading: false });
    }
    title(
        ppt_level: NftLevel, ppt_issue: NftIssue
    ) {
        const rank = ppt_level / 3 + 1;
        const name = Nft.nameOf(ppt_level);
        const id = Nft.coreId({ level: ppt_level, issue: ppt_issue });
        return `Trade staked ${name} NFTs (level ${rank}/9 & ID #${id})`;
    }
    componentDidMount = buffered(() => {
        const $image = this.ref<HTMLElement>('img');
        if ($image.current) {
            Tooltip.getInstance($image.current)?.dispose();
            Tooltip.getOrCreateInstance($image.current);
        }
    })
}
async function meta(
    level: NftLevel, issue: NftIssue, token: Token
) {
    const address = await Blockchain.selectedAddress;
    return await PptImageMeta.get(address, {
        level, issue, token
    });
}
async function href(
    ppt_level: NftLevel, ppt_issue: NftIssue, token: Token
) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ppt_wallet = new PptWallet(address, token);
    const ppt_id = Nft.coreId({
        level: ppt_level, issue: ppt_issue
    });
    const supply = await ppt_wallet.totalSupply(ppt_id);
    if (supply > 0) {
        const ppt_contract = await ppt_wallet.contract;
        const market = 'https://nftrade.com/assets/avalanche';
        return new URL(`${market}/${ppt_contract.address}/${ppt_id}`);
    }
    return null;
}
export default PptImage;
