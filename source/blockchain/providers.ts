import { BrowserProvider, JsonRpcApiProvider, JsonRpcProvider, WebSocketProvider } from 'ethers';
import { Blockchain } from '.';

import { Global } from '../types';
import { ROParams } from '../params';
declare const global: Global;

export async function MMProvider(
    polling_ms = 2000
): Promise<
    BrowserProvider | undefined
> {
    if (global.MM_PROVIDER === undefined) {
        const provider = await Blockchain.provider;
        if (provider) {
            const mm_provider = new BrowserProvider(provider);
            mm_provider.pollingInterval = polling_ms;
            global.MM_PROVIDER = mm_provider;
            return mm_provider;
        }
    }
    return global.MM_PROVIDER;
}
export async function MYProvider(
    polling_ms = 2000
): Promise<
    JsonRpcApiProvider | undefined
> {
    if (global.MY_PROVIDER === undefined) {
        const url = MYProviderUrl();
        if (url && url.startsWith('http')) {
            const rpc_provider = await RPCProvider(url, polling_ms);
            if (rpc_provider !== undefined) {
                return global.MY_PROVIDER = rpc_provider;
            }
        }
        if (url && url.startsWith('ws')) {
            const ws_provider = await WSProvider(url, polling_ms);
            if (ws_provider !== undefined) {
                return global.MY_PROVIDER = ws_provider;
            }
        }
        return global.MY_PROVIDER = await MMProvider();
    }
    return global.MY_PROVIDER;
}
async function RPCProvider(
    url: string, polling_ms: number
): Promise<
    JsonRpcProvider | undefined
> {
    const provider = new JsonRpcProvider(url);
    provider.pollingInterval = polling_ms;
    return provider;
}
async function WSProvider(
    url: string, polling_ms: number
): Promise<
    WebSocketProvider | undefined
> {
    const chain_id = await Blockchain.chainId();
    if (chain_id !== undefined) {
        const provider = new WebSocketProvider(
            new WebSocket(url), Number(chain_id)
        );
        provider.once('block', (number) => {
            if (ROParams.debug > 2) {
                console.debug('[block]', number, '!');
            }
            keepAlive(provider);
        });
        return provider;
    }
    function keepAlive(
        provider: WebSocketProvider
    ) {
        if (global.WS_PROVIDER_IID) {
            clearInterval(global.WS_PROVIDER_IID);
            delete global.WS_PROVIDER_IID;
        }
        global.WS_PROVIDER_IID = setInterval(async () => {
            const tid = setTimeout(() => {
                clearInterval(global.WS_PROVIDER_IID);
                provider.removeAllListeners();
                reconnect();
            }, polling_ms);
            const number = await provider.getBlockNumber();
            if (ROParams.debug > 2) {
                console.debug('[block]', number);
            }
            clearTimeout(tid);
        }, polling_ms);
    }
    function reconnect() {
        global.MY_PROVIDER_OTF = undefined;
        global.MY_PROVIDER = undefined;
        Blockchain.reconnect();
    }
}
function MYProviderUrl(): string | null {
    if (typeof document === 'undefined') {
        return global.MY_PROVIDER_URL ?? 'http://127.0.0.1:9650/ext/bc/C/rpc'; // test-env
    }
    const $url = document.querySelector<HTMLElement>(
        '#g-urls-provider-my'
    );
    if (!$url) {
        throw new Error('#g-urls-provider-my missing');
    }
    const url = $url.dataset.value ?? null;
    if (typeof url !== 'string') {
        throw new Error('#g-urls-provider-my[data-value] missing');
    }
    if (global.MY_PROVIDER_URL === undefined && url) {
        global.MY_PROVIDER_URL = `${new URL(url)}?code=${String.random(4)}`;
    }
    return global.MY_PROVIDER_URL ?? null;
}
