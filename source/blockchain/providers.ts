import { BrowserProvider, WebSocketProvider } from 'ethers';
import { Blockchain } from './blockchain';

import { Global } from '../types';
declare const global: Global;

export async function MMProvider() {
    if (global.MM_PROVIDER === undefined) {
        const provider = await Blockchain.provider;
        if (provider) {
            global.MM_PROVIDER = new BrowserProvider(
                provider
            );
        }
    }
    return global.MM_PROVIDER as BrowserProvider | undefined;
}
export async function WSProvider() {
    if (global.WS_PROVIDER === undefined) {
        const chain_id = await Blockchain.chainId();
        if (chain_id !== undefined) {
            global.WS_PROVIDER = new WebSocketProvider(
                new WebSocket(WSProviderUrl()), Number(chain_id)
            );
        }
    }
    return global.WS_PROVIDER as WebSocketProvider | undefined;
}
function WSProviderUrl(
    url = localStorage.getItem('ws')
) {
    if (!url) {
        const $url = document.querySelector<HTMLElement>(
            '#g-urls-provider-ws'
        );
        if (!$url) {
            throw new Error('#g-urls-provider-ws missing');
        }
        url = $url.dataset.value ?? null;
        if (!url) {
            throw new Error('#g-urls-provider-ws[data-value] missing');
        }
    }
    return new URL(url).toString();
}
