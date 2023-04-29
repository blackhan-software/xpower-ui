import { BrowserProvider, JsonRpcApiProvider, JsonRpcProvider, WebSocketProvider } from 'ethers';
import { Blockchain } from './blockchain';

import { Global } from '../types';
declare const global: Global;

export async function MMProvider(
    _url?: string, ms = Number(localStorage.getItem('mmw-polling') ?? 3000)
): Promise<
    BrowserProvider | undefined
> {
    if (global.MM_PROVIDER === undefined) {
        const provider = await Blockchain.provider;
        if (provider) {
            const mm_provider = new BrowserProvider(provider);
            global.MM_PROVIDER = mm_provider;
            mm_provider.pollingInterval = ms;
            return mm_provider;
        }
    }
    return global.MM_PROVIDER;
}
export async function MYProvider(): Promise<
    JsonRpcApiProvider | undefined
> {
    if (global.MY_PROVIDER === undefined) {
        const url = MYProviderUrl();
        if (url.startsWith('https://api.avax.network/ext/bc/C/rpc')) {
            return global.MY_PROVIDER = await MMProvider();
        }
        if (url.startsWith('ws')) {
            const wss_provider = await WSSProvider(url);
            if (wss_provider !== undefined) {
                return global.MY_PROVIDER = wss_provider;
            }
        }
        const rpc_provider = await RPCProvider(url);
        return global.MY_PROVIDER = rpc_provider;
    }
    return global.MY_PROVIDER;
}
async function WSSProvider(
    url: string, ms = Number(localStorage.getItem('wss-keep-alive') ?? 3000)
): Promise<
    WebSocketProvider | undefined
> {
    const chain_id = await Blockchain.chainId();
    if (chain_id !== undefined) {
        const provider = new WebSocketProvider(
            new WebSocket(url), Number(chain_id)
        );
        provider.once('block', () => {
            setInterval(async function keepAlive() {
                const tid = setTimeout(() => location.reload(), 2000);
                await provider.getBlockNumber();
                clearTimeout(tid);
            }, ms);
        });
        return provider;
    }
}
async function RPCProvider(
    url: string, ms = Number(localStorage.getItem('rpc-polling') ?? 3000)
): Promise<
    JsonRpcProvider | undefined
> {
    const provider = new JsonRpcProvider(url);
    provider.pollingInterval = ms;
    return provider;
}
function MYProviderUrl(
    url = localStorage.getItem('my-provider-url')
) {
    if (!url) {
        if (typeof document === 'undefined') {
            return 'http://127.0.0.1:9650/ext/bc/C/rpc'; // test-env
        }
        const $url = document.querySelector<HTMLElement>(
            '#g-urls-provider-my'
        );
        if (!$url) {
            throw new Error('#g-urls-provider-my missing');
        }
        url = $url.dataset.value ?? null;
        if (!url) {
            throw new Error('#g-urls-provider-my[data-value] missing');
        }
    }
    return `${new URL(url)}?code=${String.random(4)}`;
}
