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
export async function WSProvider(
    url = 'wss://api.avax.network/ext/bc/C/ws'
) {
    if (global.WS_PROVIDER === undefined) {
        const chain_id = await Blockchain.chainId();
        if (chain_id !== undefined) {
            const ws = localStorage.getItem('ws') ?? url;
            global.WS_PROVIDER = new WebSocketProvider(
                new WebSocket(ws), Number(chain_id)
            );
        }
    }
    return global.WS_PROVIDER as WebSocketProvider | undefined;
}
