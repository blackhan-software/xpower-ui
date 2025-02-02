import './swap.scss';

import { x40 } from '../../source/functions';
import { RWParams } from '../../source/params';
import { Address, Page, Token, TokenInfo } from '../../source/redux/types';
import { DEX } from '../../source/types';

import React, { memo, useContext, useEffect, useState } from 'react';
import { Span, TokenContext } from '../../source/react';

type Props = {
    page: Page;
}
export function UiSwap({ page }: Props) {
    const [token] = useContext(TokenContext);
    const [dex, set_dex] = useState<DEX | URL | null>(null);
    useEffect(() => {
        if (dex) RWParams.dex = dex;
    }, [dex]);
    useEffect(() => {
        if (page === Page.Swap) set_dex(RWParams.dex)
    }, [page]);
    useEffect(() => {
        const content = document.querySelector('content');
        const content_cls = ['d-flex', 'flex-column', 'min-vh-xyz'];
        const footer = document.querySelector('footer');
        const footer_cls = ['pt-extra'];
        if (page === Page.Swap) {
            content?.classList.add(...content_cls);
            footer?.classList.add(...footer_cls);
        } else {
            content?.classList.remove(...content_cls);
            footer?.classList.remove(...footer_cls);
        }
    }, [page]);
    if (dex) {
        return <>
            <Iframe dex={dex} token={token} />
        </>;
    }
    return <Spinner show={true} grow={true} />;
}
const Iframe = memo(({ dex, token }: {
    dex: DEX | URL, token: Token
}) => {
    const { address } = TokenInfo(token);
    const src = typeof dex !== 'string'
        ? dex.toString().replace(/\$?{a}|\$?{address}/i, x40(address))
        : URLS[dex](x40(address));
    return <iframe src={src} />;
});
Iframe.displayName = 'Iframe';
const URLS = {
    [DEX.paraswap]: (a: Address) => {
        return `https://app.paraswap.io/#/swap/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE-${a}/1/SELL?network=avalanche&version=6`;
    },
    [DEX.uniswap]: (a: Address) => {
        return `https://app.uniswap.org/swap?outputCurrency=${a}&chain=avalanche`;
    }
};
function Spinner(
    props: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        props.grow ? 'spinner-grow' : '',
        !props.show ? 'd-none' : '',
    ];
    return <Span
        className={classes.join(' ')} role='status'
    />;
}
export default UiSwap;
