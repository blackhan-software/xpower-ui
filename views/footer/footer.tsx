import './footer.scss';

import { Blockchain, Chain, ChainId } from '../../source/blockchain';
import { ROParams } from '../../source/params';
import { AppState, Store } from '../../source/redux/store';
import { NFTokenInfo, PPTokenInfo, Page, Token, TokenInfo } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { Version } from '../../source/types';

import React, { createElement, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, connect } from 'react-redux';
import { x40 } from '../../source/functions';

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
    return <nav className={
        [...classes, !props.ok ? 'underlay' : ''].join(' ')
    }>
        <ul className='navbar-nav'>
            {$linkedin()}
        </ul>
        <ul className='navbar-nav d-flex flex-row ml-auto'>
            {$migrate(props)}
            {$contract(props)}
            {$addToken(props)}
            {$github()}
            {$youtube()}
            {$discord()}
            {$telegram()}
            {$twitter()}
            {$avalanche()}
        </ul>
    </nav>;
}
function $linkedin() {
    return <li className='nav-item'>
        <a className='nav-link link-light lower linkedin'
            data-bs-toggle='tooltip' data-bs-placement='top'
            href='https://www.linkedin.com/company/blackhan'
            title='LinkedIn' target='_blank'
        >
            <span>&copy;</span>
            <span>{
                ' ' + new Date().getFullYear()
            }</span>
            <span className='d-none d-sm-inline'>{
                ' ' + 'Blackhan Software Ltd'
            }</span>
        </a>
    </li>;
}
function $migrate(
    { token }: Props
) {
    return <li className='nav-item pb-1 pt-1 pe-1'>
        <a className='nav-link link-light lower migrate'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Migrate tokens' href={`/migrate?token=${token}`}
        >
            <i className='bi bi-capslock-fill'></i>
            <i className='bi bi-capslock'></i>
        </a>
    </li>;
}
function $contract(
    { chainId, page, token, version }: Props & { chainId: ChainId }
) {
    const { url, tip } = contractInfo(chainId, page, token, version);
    return <li className='nav-item pb-1 pt-1 pe-1'>
        <a className='nav-link link-light lower smart-contract'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title={tip} target='_blank' href={url}
        >
            <i className='bi bi-cpu-fill'></i>
            <i className='bi bi-cpu'></i>
        </a>
    </li>;
}
function $addToken(
    { token, version }: Props
) {
    return <li className='nav-item pb-1 pt-1 pe-1'>
        <a className='nav-link link-light lower add-token'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title={`Add the ${token} token to your Metamask`}
            href='#' onClick={addToken.bind(null, token, version)}
        >
            <i className='bi bi-plus-square-fill'></i>
            <i className='bi bi-plus-square'></i>
        </a>
    </li>;
}
function $github() {
    return <li className='nav-item pb-1 pt-1 pe-1'>
        <a className='nav-link link-light lower github'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='GitHub' href='https://github.com/blackhan-software'
            target='_blank'
        >
            <i className='bi bi-github'></i>
        </a>
    </li>;
}
function $discord() {
    return <li className='nav-item pb-1 pt-1 pe-1'>
        <a className='discord nav-link'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Discord' href='https://discord.gg/43ChQHEvzV'
            target='_blank' rel='noreferrer'
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-discord' width='16' height='16' viewBox='0 0 16 16' role='img'>
                <path fill='currentColor' d='M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z'></path>
            </svg>
        </a>
    </li>;
}
function $youtube() {
    return <li className='nav-item pb-1 pt-1 pe-1'>
        <a className='youtube nav-link'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='YouTube' href='https://www.youtube.com/channel/UCDcdGJmkBLYpWJO-17kCFsA'
            target='_blank' rel='noreferrer'
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='fff bi bi-youtube' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                <path d='M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z' />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="red bi bi-youtube" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M 8.051,1.999 H 8.14 c 0.822,0.003 4.987,0.033 6.11,0.335 a 2.01,2.01 0 0 1 1.415,1.42 c 0.101,0.38 0.172,0.883 0.22,1.402 l 0.01,0.104 0.022,0.26 0.008,0.104 c 0.065,0.914 0.073,1.77 0.074,1.957 v 0.075 c -0.001,0.194 -0.01,1.108 -0.082,2.06 L 15.909,9.821 15.9,9.925 c -0.05,0.572 -0.124,1.14 -0.235,1.558 a 2.007,2.007 0 0 1 -1.415,1.42 c -1.16,0.312 -5.569,0.334 -6.18,0.335 H 7.928 c -0.309,0 -1.587,-0.006 -2.927,-0.052 L 4.831,13.18 4.744,13.176 4.573,13.169 4.402,13.162 C 3.292,13.113 2.235,13.034 1.748,12.902 A 2.007,2.007 0 0 1 0.333,11.483 C 0.222,11.066 0.148,10.497 0.098,9.925 L 0.09,9.82 0.082,9.716 A 31.4,31.4 0 0 1 0,7.68 V 7.557 C 0.002,7.342 0.01,6.599 0.064,5.779 L 0.071,5.676 0.074,5.624 0.082,5.52 0.104,5.26 0.114,5.156 C 0.162,4.637 0.233,4.133 0.334,3.754 A 2.007,2.007 0 0 1 1.749,2.334 C 2.236,2.204 3.293,2.124 4.403,2.074 L 4.573,2.067 4.745,2.061 4.831,2.058 5.002,2.051 A 99.788,99.788 0 0 1 7.858,2 h 0.193 z" style={{ fill: '#ff0000' }} />
                <path d="m 6.4,5.209 v 4.818 l 4.157,-2.408 z" style={{ fill: '#ffffff' }} />
            </svg>
        </a>
    </li>;
}
function $telegram() {
    return <li className='nav-item pb-1 pt-1 pe-1'>
        <a className='telegram nav-link'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Telegram' href='https://t.me/+hv7s-mkabhw5ZjQ0'
            target='_blank' rel='noreferrer'
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-telegram' width='16' height='16' viewBox='0 0 16 16' role='img'>
                <path fill='currentColor' d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z'></path>
            </svg>
        </a>
    </li>;
}
function $twitter() {
    return <li className='nav-item pb-1 pt-1 pe-1'>
        <a className='twitter nav-link'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Twitter' href='https://twitter.com/xpowermine'
            target='_blank' rel='noreferrer'
        >
            <svg xmlns='http://www.w3.org/2000/svg' className='bi bi-twitter' width='16' height='16' viewBox='0 0 16 16' role='img'>
                <path fill='currentColor' d='M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z'></path>
            </svg>
        </a>
    </li>;
}
function $avalanche() {
    return <li className='nav-item d-none d-sm-block'>
        <a className='avalanche nav-link'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Powered by Avalanche' href='https://www.avalabs.org/'
            target='_blank' rel='noreferrer'
        >
            <img className='fff'
                src='/images/png/avalanche-logo/powered-by-avalanche[fff].png'
                alt='Avalanche Logo' height='32' width='93' />
            <img className='red'
                src='/images/png/avalanche-logo/powered-by-avalanche[red].png'
                alt='Avalanche Logo' height='32' width='93' />
        </a>
    </li>;
}
function contractInfo(
    chainId: ChainId, page: Page, token: Token, version: Version
): {
    url: string; tip: string;
} {
    const urls = new Chain(chainId).explorerUrls;
    const explorer = urls.length ? urls[0] : '';
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
        return <nav className={[...classes, 'overlay'].join(' ')}>
            <ul className='navbar-nav'>
                {$cookies()}
            </ul>
            <ul className='navbar-nav d-flex flex-row ml-auto'>
                {$consent(props.set_ok)}
            </ul>
        </nav>;
    }
    return null;
}
function $cookies(
    href = 'https://cookie-consent.app.forthe.top/why-websites-use-cookies/'
) {
    return <li className='nav-item'>
        › We use cookies<span className='d-none d-sm-inline'>&nbsp;to improve your experience</span>; <a className='consent' href={href} target='_blank'>see consent</a>.
    </li>;
}
function $consent(
    set_ok: (ok: boolean) => void
) {
    return <li className='nav-item'>
        <button
            className='btn btn-outline-warning'
            onClick={() => set_ok(true)} type='button'
        >OK</button>
    </li>;
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
