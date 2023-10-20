import './swap.scss';

import { x40 } from '../../source/functions';
import { RWParams } from '../../source/params';
import { Address, Page, Token, TokenInfo } from '../../source/redux/types';
import { DEX } from '../../source/types';

import React, { memo, useContext, useEffect, useState } from 'react';
import { Paraswap, Uniswap } from '../../public/images/tsx';
import { capitalize } from '../../routes/functions';
import { TokenContext } from '../../source/react';

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
        const content_cls = ['d-flex', 'flex-column', 'min-vh-100'];
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
            <DexSelectors dex={dex} set_dex={set_dex} />
            <Iframe dex={dex} token={token} />
        </>;
    }
    return <Spinner show={true} grow={true} />;
}
function DexSelectors({ dex, set_dex }: {
    dex: DEX | URL, set_dex: React.Dispatch<React.SetStateAction<typeof dex | null>>
}) {
    return <div
        className='btn-group mb-3 mt-2 dex-selectors' role='group'
    >
        <DexSelector
            dex={DEX.paraswap}
            active={dex === DEX.paraswap}
            onClick={() => set_dex(DEX.paraswap)} />
        <DexSelector
            dex={DEX.uniswap}
            active={dex === DEX.uniswap}
            onClick={() => set_dex(DEX.uniswap)} />
    </div>;
}
function DexSelector({ dex, active, onClick }: {
    dex: DEX, active?: boolean, onClick?: React.MouseEventHandler,
}) {
    const classes = [
        'btn', 'btn-outline-warning',
        active ? 'active' : '',
        'dex-selector', dex,
    ];
    return <button
        className={classes.join(' ')} type='button'
        onClick={onClick}
    >
        <DexIcon dex={dex} />&nbsp;{capitalize(dex)}
    </button>;
}
function DexIcon({ dex }: { dex: DEX }) {
    if (dex === DEX.paraswap) {
        return <span className='float-start'>
            <Paraswap />
        </span>;
    }
    if (dex === DEX.uniswap) {
        return <span className='float-start'>
            <Uniswap />
        </span>;
    }
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
const URLS = {
    [DEX.paraswap]: (a: Address) => {
        return `https://app.paraswap.io/#/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE-${a}/1/SELL?network=avalanche`;
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
    return <span
        className={classes.join(' ')} role='status'
    />;
}
export default UiSwap;
