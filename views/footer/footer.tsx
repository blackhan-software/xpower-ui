import './footer.scss';

import { Blockchain, Chain, ChainId } from '../../source/blockchain';
import { x40 } from '../../source/functions';
import { ROParams } from '../../source/params';
import { AppState, Store } from '../../source/redux/store';
import { NFTokenInfo, PPTokenInfo, Page, Token, TokenInfo } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { Version } from '../../source/types';

import React, { createElement, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, connect } from 'react-redux';
import { A, Button, Li, Nav, Span, Ul, useLongTap } from '../../source/react';

import SafeWallet from '../../public/images/tsx/safe-wallet-fill';

type Props = {
    page: Page;
    token: Token;
    version: Version;
}
export function UiFooter(
    props: Props
) {
    const [ok, set_ok] = useState(
        Boolean(localStorage.getItem('ui-footer:ok'))
    );
    useEffect(() => {
        if (ok) localStorage.setItem('ui-footer:ok', '1');
    }, [ok]);
    const [id, set_id] = useState<ChainId>(
        ChainId.AVALANCHE_MAINNET
    );
    useEffect(() => {
        Blockchain.chainId().then((id) => id && set_id(id));
    }, [id]);
    return <React.StrictMode>
        {$underlay({
            ...props, ok, chainId: id
        })}
        {$overlay({
            ...props, ok, set_ok
        })}
    </React.StrictMode>;
}
function $underlay(
    props: Props & { ok: boolean, chainId: ChainId }
) {
    const classes = [
        'navbar', 'px-2 py-0'
    ];
    return <Nav className={
        [...classes, !props.ok ? 'underlay' : ''].join(' ')
    }>
        <Ul className='navbar-nav'>
            {$company()}
        </Ul>
        <Ul className='navbar-nav d-flex flex-row ml-auto'>
            {$migrate(props)}
            {$gnosis()}
            {$contract(props)}
            {$addToken(props)}
            {$github()}
            {$coingecko(props)}
            {$youtube()}
            {$discord()}
            {$telegram()}
            {$twitter()}
            {$avalanche()}
        </Ul>
    </Nav>;
}
function $company() {
    return <Li className='nav-item'>
        <Span className='nav-link lower company'
            title='P.O. Box 2255, Shedden Road, Georgetown, Grand Cayman KY1-1107, KY'
        >
            <span>&copy;</span>
            <span>{
                ' ' + new Date().getFullYear()
            }</span>
            <span className='d-none d-sm-inline'>{
                ' ' + 'Moorhead LLC'
            }</span>
        </Span>
    </Li>;
}
function $migrate(
    { token }: Props
) {
    return <Li className='nav-item pb-1 pt-1 pe-0'>
        <A className='nav-link lower migrate'
            href={`/migrate?token=${token}`}
            title='Migrate tokens'
        >
            <i className='bi bi-capslock-fill'></i>
            <i className='bi bi-capslock'></i>
        </A>
    </Li>;
}
function $gnosis() {
    const [fill, set_fill] = useState(true);
    return <Li className='nav-item pb-1 pt-1 pe-0'>
        <A className='safe-wallet nav-link'
            href='https://app.safe.global/share/safe-app?appUrl=https%3A%2F%2Fwww.xpowermine.com&chain=avax'
            onMouseEnter={() => set_fill(false)}
            onMouseLeave={() => set_fill(true)}
            onTouchStart={() => set_fill(false)}
            onTouchEnd={() => set_fill(true)}
            rel='noreferrer' target='_blank'
            title='Safe{WALLET}'
        >
            <SafeWallet fill={fill} />
        </A>
    </Li>;
}
function $contract(
    { chainId, page, token, version }: Props & { chainId: ChainId }
) {
    const $ref = useRef<HTMLAnchorElement>(null);
    const [long] = useLongTap($ref, () => { });
    const [ctrl, set_ctrl] = useState(false);
    useEffect(() => {
        const handler = (e: KeyboardEvent) => set_ctrl(e.ctrlKey);
        global.addEventListener('keydown', handler);
        global.addEventListener('keyup', handler);
        return () => {
            global.removeEventListener('keydown', handler);
            global.removeEventListener('keyup', handler);
        };
    }, []);
    const { url, tip } = contractInfo(
        { chainId, page, token, version }, long || ctrl ? 1 : 0
    );
    return <Li className='nav-item pb-1 pt-1 pe-1'>
        <A className='nav-link smart-contract lower'
            href={url} ref={$ref} target='_blank' title={tip}
        >
            <i className='bi bi-cpu-fill'></i>
            <i className='bi bi-cpu'></i>
        </A>
    </Li>;
}
function $addToken(
    { token, version }: Props
) {
    return <Li className='nav-item pb-1 pt-1 pe-1'>
        <A className='add-token nav-link lower'
            onClick={addToken.bind(null, token, version)}
            href='#' title={`Add ${token}s to wallet`}
        >
            <i className='bi bi-plus-square-fill'></i>
            <i className='bi bi-plus-square'></i>
        </A>
    </Li>;
}
function $coingecko(
    { token }: Props
) {
    return <Li className='nav-item pb-1 pt-1 pe-1'>
        <A className='coingecko nav-link upper'
            href={`https://www.coingecko.com/en/coins/xpowermine-com-${Tokenizer.lower(token)}`}
            rel='noreferrer' target='_blank' title={`${token}s at CoinGecko`}
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='white bi bi-coingecko' width='16' height='16' viewBox='0 0 276 276'>
                <path
                    fill='none' stroke='currentColor' strokeWidth='12'
                    d='M269.62,137.42 A131.63,131.63,0,1,1,137.41,6.37v0A131.63,131.63,0,0,1,269.62,137.42Z'
                />
                <path fill='currentColor' d='M202.74,92.39c-9.26-2.68-18.86-6.48-28.58-10.32-.56-2.44-2.72-5.48-7.09-9.19-6.35-5.51-18.28-5.37-28.59-2.93-11.38-2.68-22.62-3.63-33.41-1C16.82,93.26,66.86,152.57,34.46,212.19c4.61,9.78,54.3,66.84,126.2,51.53,0,0-24.59-59.09,30.9-87.45C236.57,153.18,269.09,110.46,202.74,92.39Z' />
                <path fill='var(--xp-gray-dark)' d='M213.64,131.2a5.35,5.35,0,1,1-5.38-5.32A5.36,5.36,0,0,1,213.64,131.2Z' />
                <path fill='currentColor' d='M138.48,69.91c6.43.46,29.68,8,35.68,12.12-5-14.5-21.83-16.43-35.68-12.12Z' />
                <path fill='var(--xp-gray-dark)' d='M144.6,106.58a24.68,24.68,0,1,1-24.69-24.67h0a24.68,24.68,0,0,1,24.68,24.66Z' />
                <path fill='currentColor' d='M137.28,106.8a17.36,17.36,0,1,1-17.36-17.36h0A17.36,17.36,0,0,1,137.28,106.8Z' />
                <path fill='currentColor' d='M233.63,142.08c-20,14.09-42.74,24.78-75,24.78-15.1,0-18.16-16-28.14-8.18-5.15,4.06-23.31,13.14-37.72,12.45S55,162,48.49,131.23C45.91,162,44.59,184.65,33,210.62c23,36.83,77.84,65.24,127.62,53C155.31,226.27,188,189.69,206.34,171c7-7.09,20.3-18.66,27.29-28.91Z' />
                <path fill='var(--xp-gray-dark)' d='M232.85,143c-6.21,5.66-13.6,9.85-21.12,13.55a134.9,134.9,0,0,1-23.7,8.63c-8.16,2.11-16.67,3.7-25.29,2.92s-17.43-3.71-23.14-10.17l.27-.31c7,4.54,15.08,6.14,23.12,6.37a108.27,108.27,0,0,0,24.3-2,132.71,132.71,0,0,0,23.61-7.3c7.63-3.15,15.18-6.8,21.68-12Z' />
            </svg>
            <svg xmlns='http://www.w3.org/2000/svg' className='color bi bi-coingecko' width='16' height='16' viewBox='0 0 276 276'>
                <path
                    fill='none' stroke='#8dc63f' strokeWidth='12'
                    d='M269.62,137.42 A131.63,131.63,0,1,1,137.41,6.37v0A131.63,131.63,0,0,1,269.62,137.42Z'
                />
                <path fill='#f9e988' d='M265.65,137.44a127.63,127.63,0,1,1-128.21-127h0A127.65,127.65,0,0,1,265.65,137.44Z' />
                <path fill='#ffffff' d='M140.35,18.66a70.18,70.18,0,0,1,24.53,0,74.75,74.75,0,0,1,23.43,7.85c7.28,4,13.57,9.43,19.83,14.52s12.49,10.3,18.42,16a93.32,93.32,0,0,1,15.71,19,108.28,108.28,0,0,1,11,22.17c5.33,15.66,7.18,32.53,4.52,48.62H257c-2.67-15.95-6.29-31.15-12-45.61A177.51,177.51,0,0,0,235.56,80,209.1,209.1,0,0,0,223.14,60a72.31,72.31,0,0,0-16.64-16.8c-6.48-4.62-13.93-7.61-21.14-10.45S171,27,163.48,24.84s-15.16-3.78-23.14-5.35Z' />
                <path fill='#8bc53f' d='M202.74,92.39c-9.26-2.68-18.86-6.48-28.58-10.32-.56-2.44-2.72-5.48-7.09-9.19-6.35-5.51-18.28-5.37-28.59-2.93-11.38-2.68-22.62-3.63-33.41-1C16.82,93.26,66.86,152.57,34.46,212.19c4.61,9.78,54.3,66.84,126.2,51.53,0,0-24.59-59.09,30.9-87.45C236.57,153.18,269.09,110.46,202.74,92.39Z' />
                <path fill='#ffffff' d='M213.64,131.2a5.35,5.35,0,1,1-5.38-5.32A5.36,5.36,0,0,1,213.64,131.2Z' />
                <path fill='#009345' d='M138.48,69.91c6.43.46,29.68,8,35.68,12.12-5-14.5-21.83-16.43-35.68-12.12Z' />
                <path fill='#ffffff' d='M144.6,106.58a24.68,24.68,0,1,1-24.69-24.67h0a24.68,24.68,0,0,1,24.68,24.66Z' />
                <path fill='#58595b' d='M137.28,106.8a17.36,17.36,0,1,1-17.36-17.36h0A17.36,17.36,0,0,1,137.28,106.8Z' />
                <path fill='#8bc53f' d='M233.63,142.08c-20,14.09-42.74,24.78-75,24.78-15.1,0-18.16-16-28.14-8.18-5.15,4.06-23.31,13.14-37.72,12.45S55,162,48.49,131.23C45.91,162,44.59,184.65,33,210.62c23,36.83,77.84,65.24,127.62,53C155.31,226.27,188,189.69,206.34,171c7-7.09,20.3-18.66,27.29-28.91Z' />
                <path fill='#58595b' d='M232.85,143c-6.21,5.66-13.6,9.85-21.12,13.55a134.9,134.9,0,0,1-23.7,8.63c-8.16,2.11-16.67,3.7-25.29,2.92s-17.43-3.71-23.14-10.17l.27-.31c7,4.54,15.08,6.14,23.12,6.37a108.27,108.27,0,0,0,24.3-2,132.71,132.71,0,0,0,23.61-7.3c7.63-3.15,15.18-6.8,21.68-12Z' />
            </svg>
        </A>
    </Li>;
}
function $github() {
    return <Li className='nav-item pb-1 pt-1 pe-1'>
        <A className='github nav-link lower'
            href='https://github.com/blackhan-software'
            target='_blank' title='GitHub'
        >
            <i className='bi bi-github'></i>
        </A>
    </Li>;
}
function $discord() {
    return <Li className='nav-item pb-1 pt-1 pe-1'>
        <A className='discord nav-link upper'
            href='https://discord.gg/43ChQHEvzV' rel='noreferrer'
            target='_blank' title='Discord'
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-discord' width='16' height='16' viewBox='0 0 16 16' role='img'>
                <path fill='currentColor' d='M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z'></path>
            </svg>
        </A>
    </Li>;
}
function $youtube() {
    return <Li className='nav-item pb-1 pt-1 pe-1'>
        <A className='youtube nav-link'
            href='https://www.youtube.com/channel/UCDcdGJmkBLYpWJO-17kCFsA'
            rel='noreferrer' target='_blank' title='YouTube'
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='fff bi bi-youtube' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                <path d='M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z' />
            </svg>
            <svg xmlns='http://www.w3.org/2000/svg' className='red bi bi-youtube' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                <path d='M 8.051,1.999 H 8.14 c 0.822,0.003 4.987,0.033 6.11,0.335 a 2.01,2.01 0 0 1 1.415,1.42 c 0.101,0.38 0.172,0.883 0.22,1.402 l 0.01,0.104 0.022,0.26 0.008,0.104 c 0.065,0.914 0.073,1.77 0.074,1.957 v 0.075 c -0.001,0.194 -0.01,1.108 -0.082,2.06 L 15.909,9.821 15.9,9.925 c -0.05,0.572 -0.124,1.14 -0.235,1.558 a 2.007,2.007 0 0 1 -1.415,1.42 c -1.16,0.312 -5.569,0.334 -6.18,0.335 H 7.928 c -0.309,0 -1.587,-0.006 -2.927,-0.052 L 4.831,13.18 4.744,13.176 4.573,13.169 4.402,13.162 C 3.292,13.113 2.235,13.034 1.748,12.902 A 2.007,2.007 0 0 1 0.333,11.483 C 0.222,11.066 0.148,10.497 0.098,9.925 L 0.09,9.82 0.082,9.716 A 31.4,31.4 0 0 1 0,7.68 V 7.557 C 0.002,7.342 0.01,6.599 0.064,5.779 L 0.071,5.676 0.074,5.624 0.082,5.52 0.104,5.26 0.114,5.156 C 0.162,4.637 0.233,4.133 0.334,3.754 A 2.007,2.007 0 0 1 1.749,2.334 C 2.236,2.204 3.293,2.124 4.403,2.074 L 4.573,2.067 4.745,2.061 4.831,2.058 5.002,2.051 A 99.788,99.788 0 0 1 7.858,2 h 0.193 z' style={{ fill: '#ff0000' }} />
                <path d='m 6.4,5.209 v 4.818 l 4.157,-2.408 z' style={{ fill: '#ffffff' }} />
            </svg>
        </A>
    </Li>;
}
function $telegram() {
    return <Li className='nav-item pb-1 pt-1 pe-1'>
        <A className='telegram nav-link'
            href='https://t.me/+hv7s-mkabhw5ZjQ0' rel='noreferrer'
            target='_blank' title='Telegram'
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-telegram' width='16' height='16' viewBox='0 0 16 16' role='img'>
                <path fill='currentColor' d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z'></path>
            </svg>
        </A>
    </Li>;
}
function $twitter() {
    return <Li className='nav-item pb-1 pt-1 pe-1'>
        <A className='twitter nav-link'
            href='https://twitter.com/xpowermine' rel='noreferrer'
            target='_blank' title='Twitter'
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-twitter' width='16' height='16' viewBox='0 0 16 16' role='img'>
                <path fill='currentColor' d='M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z'></path>
            </svg>
        </A>
    </Li>;
}
function $avalanche() {
    return <Li className='nav-item ps-1 d-none d-sm-block'>
        <A className='avalanche nav-link'
            href='https://www.avalabs.org/' rel='noreferrer'
            target='_blank' title='Powered by Avalanche'
        >
            <img className='fff'
                src='/images/png/avalanche-logo/powered-by-avalanche[fff].png'
                alt='Avalanche Logo' height='32' width='93' />
            <img className='red'
                src='/images/png/avalanche-logo/powered-by-avalanche[red].png'
                alt='Avalanche Logo' height='32' width='93' />
        </A>
    </Li>;
}
function contractInfo({
    chainId, page, token, version
}: {
    chainId: ChainId; page: Page; token: Token; version: Version;
}, index = 0): {
    url: string; tip: string;
} {
    const urls = new Chain(chainId).explorerUrls;
    const explorer =
        urls.length > index ? urls[index]
            : urls.length > 0 ? urls[0] : '';
    switch (page) {
        case Page.Nfts: {
            const { address } = NFTokenInfo(token, version);
            const xtoken = Tokenizer.xify(token);
            return {
                url: `${explorer}/address/${x40(address)}`,
                tip: `Smart contract of stakeable ${xtoken} NFTs`,
            };
        }
        case Page.Ppts: {
            const { address } = PPTokenInfo(token, version);
            const xtoken = Tokenizer.xify(token);
            return {
                url: `${explorer}/address/${x40(address)}`,
                tip: `Smart contract of staked ${xtoken} NFTs`,
            }
        }
        default: {
            const { address } = TokenInfo(token, version);
            return {
                url: `${explorer}/address/${x40(address)}`,
                tip: `Smart contract of ${token}s`,
            }
        }
    }
}
async function addToken(
    token: Token, version: Version
) {
    if (Tokenizer.xified(token)) {
        addMoeToken(token, version);
    } else {
        addSovToken(token, version);
    }
}
async function addMoeToken(
    token: Token, version: Version
) {
    const xtoken = Tokenizer.xify(token);
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const $moe = document.getElementById(
                `g-${xtoken}_MOE_${version}`
            );
            const $image = document.getElementById(
                `g-${xtoken}_MOE_IMAGE`
            );
            Blockchain.addToken({
                address: BigInt($moe?.dataset.value as string),
                symbol: xtoken,
                decimals: version < Version.v5a ? 0 : 18,
                image: String($image?.dataset.value)
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
}
async function addSovToken(
    token: Token, version: Version
) {
    const atoken = Tokenizer.aify(token);
    const xtoken = Tokenizer.xify(token);
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const $sov = document.getElementById(
                `g-${xtoken}_SOV_${version}`
            );
            const $image = document.getElementById(
                `g-${xtoken}_SOV_IMAGE`
            );
            Blockchain.addToken({
                address: BigInt($sov?.dataset.value as string),
                symbol: atoken,
                decimals: 18,
                image: String($image?.dataset.value)
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
}
function $overlay(
    props: Props & { ok: boolean, set_ok: (ok: boolean) => void },
) {
    const classes = [
        'navbar', 'px-2 py-0'
    ];
    if (props.ok === false) {
        return <Nav className={[...classes, 'overlay'].join(' ')}>
            <Ul className='navbar-nav'>
                {$cookies()}
            </Ul>
            <Ul className='navbar-nav d-flex flex-row ml-auto'>
                {$consent(props.set_ok)}
            </Ul>
        </Nav>;
    }
    return null;
}
function $cookies(
    href = 'https://cookie-consent.app.forthe.top/why-websites-use-cookies/'
) {
    return <Li className='nav-item'>
        › We use cookies<span className='d-none d-sm-inline'>&nbsp;to improve your experience</span>; <A className='consent' href={href} target='_blank'>see consent</A>.
    </Li>;
}
function $consent(
    set_ok: (ok: boolean) => void
) {
    return <Li className='nav-item btn-group'>
        <Button
            className='btn btn-outline-warning'
            onClick={() => set_ok(true)}
        >OK</Button>
    </Li>;
}
if (require.main === module) {
    const mapper = ({ page, token }: AppState) => ({
        page, token, version: ROParams.version
    });
    const $ui_footer = createElement(connect(mapper)(UiFooter));
    const $footer = document.querySelector('footer');
    createRoot($footer!).render(
        <Provider store={Store()}>{$ui_footer}</Provider>
    );
}
export default UiFooter;
