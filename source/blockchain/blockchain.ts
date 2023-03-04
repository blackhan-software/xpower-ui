/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint no-async-promise-executor: [off] */

import { x40 } from '../functions';
import { ROParams, RWParams } from '../params';
import { Address, Token, TokenInfo, XTokens } from '../redux/types';
import { Version } from '../types';
import { Chain, ChainId } from './chain';

import detectProvider from '@metamask/detect-provider';
import { EventEmitter } from 'events';

export type Provider = Awaited<ReturnType<typeof detectProvider>> & {
    request: (...args: any[]) => any;
    isConnected: () => boolean;
} & EventEmitter;
export type Connect = {
    address: Address, chainId: ChainId, token: Token, version: Version
};
export class Blockchain extends EventEmitter {
    private static get me(): Blockchain {
        if (this._me === undefined) {
            this._me = new Blockchain();
        }
        return this._me;
    }
    private constructor() {
        super(); this.setMaxListeners(200);
    }
    public static get provider(): Promise<Provider> {
        return this.me.provider();
    }
    private async provider(): Promise<Provider> {
        if (this._provider === undefined || this._provider === null) {
            const provider = await detectProvider();
            this._provider = provider as any;
        }
        return this._provider as Provider;
    }
    public static isInstalled(): Promise<boolean> {
        return this.me.isInstalled();
    }
    private async isInstalled(): Promise<boolean> {
        if (this._isInstalled === undefined) {
            this._isInstalled = await this.provider().then(
                (p) => Boolean(p)
            );
        }
        return Boolean(this._isInstalled);
    }
    public static isConnected(): Promise<boolean> {
        return this.me.isConnected();
    }
    private async isConnected(): Promise<boolean> {
        if (this._isConnected === undefined) {
            this._isConnected = await this.provider().then(
                (p) => Boolean(p?.isConnected())
            );
        }
        return Boolean(this._isConnected);
    }
    public static async connect(): Promise<Address> {
        return this.me.connect();
    }
    private async connect(): Promise<Address> {
        const accounts = await this.provider().then((p) => p?.request({
            method: 'eth_requestAccounts'
        }));
        if (!accounts?.length) {
            throw new Error('missing accounts');
        }
        const address = await this.selectedAddress();
        if (!address) {
            throw new Error('missing selected-address');
        }
        setTimeout(async () => {
            const info = {
                address,
                chainId: await this.chainId(),
                token: RWParams.token,
                version: ROParams.version
            };
            this.emit('connect', info);
        });
        return address;
    }
    public static get selectedAddress(): Promise<Address | null> {
        return this.me.selectedAddress();
    }
    private async selectedAddress(): Promise<Address | null> {
        if (this._selectedAddress === null && this._provider) {
            const req = this.provider().then((p) => p?.request({
                method: 'eth_accounts'
            }));
            this._selectedAddress = await req.then((a: string[]) =>
                a?.length > 0 ? BigInt(a[0]) : null
            );
        }
        return this._selectedAddress;
    }
    public static async isAvalanche(): Promise<boolean> {
        return this.me.isAvalanche();
    }
    private async isAvalanche(): Promise<boolean> {
        const id = await this.chainId();
        if (id === ChainId.AVALANCHE_MAINNET) {
            return true;
        }
        if (id === ChainId.AVALANCHE_FUJI) {
            return true;
        }
        if (id === ChainId.AVALANCHE_LOCAL) {
            return true;
        }
        if (id === ChainId.HARDHAT) {
            return true;
        }
        return false;
    }
    public static async switchTo(id: ChainId) {
        await this.me.switchTo(id);
    }
    private async switchTo(id: ChainId) {
        const chain = new Chain(id);
        await this.provider().then((p) => p?.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: chain.id,
                chainName: chain.name,
                nativeCurrency: chain.currency,
                rpcUrls: chain.rpcUrls,
                blockExplorerUrls: chain.explorerUrls
            }]
        }));
    }
    public static async addToken(info: TokenInfo) {
        return this.me.addToken(info);
    }
    private async addToken(info: TokenInfo) {
        return await this.provider().then((p) => p?.request({
            method: 'wallet_watchAsset', params: {
                type: 'ERC20', options: {
                    ...info, address: x40(info.address)
                }
            }
        }));
    }
    public static onConnect(
        listener: (options: Connect) => void
    ) {
        return this.me.onConnect(listener);
    }
    private onConnect(
        listener: (options: Connect) => void
    ) {
        this.on('connect', listener);
        return () => {
            this.off('connect', listener);
        };
    }
    public static onceConnect(
        listener: (options: Connect) => void, context?: {
            per: () => Token, tokens?: Set<Token>
        }
    ) {
        return this.me.onceConnect(listener, context);
    }
    private onceConnect(
        listener: (options: Connect) => void, context?: {
            per: () => Token, tokens?: Set<Token>
        }
    ) {
        if (context === undefined) {
            this.once('connect', listener);
            return () => { this.off('connect', listener); }
        }
        if (context.tokens === undefined) {
            context.tokens = new Set(XTokens());
        }
        const handlers = [] as Array<(options: Connect) => void>;
        for (const token of context.tokens) {
            const handler = (options: Connect) => {
                if (token === context.per()) {
                    this.off('connect', handler);
                    listener(options);
                }
            };
            this.on('connect', handler);
            handlers.push(handler);
        }
        return () => {
            handlers.forEach((handler) => {
                this.off('connect', handler);
            });
        };
    }
    private async chainId(): Promise<ChainId | undefined> {
        if (this._chainId === undefined && this._provider) try {
            const chain_id = await this.provider().then(
                (p) => p?.request({ method: 'eth_chainId' })
            );
            if (chain_id && chain_id.length) {
                this._chainId = `0x${Number(chain_id).toString(16)}` as ChainId;
            }
        } catch (ex: any) {
            console.error(ex);
        }
        return this._chainId;
    }
    private get _provider(): Provider | undefined {
        return this.__provider;
    }
    private set _provider(provider: Provider | undefined) {
        if (ROParams.debug > 1) {
            console.debug('[Blockchain.provider]', provider);
        }
        if (ROParams.debug > 2 && provider) {
            const request = provider.request;
            const reques_dbg = (...args: any[]) => {
                console.debug('[Blockchain.provider.request]', ...args);
                return request.call(provider, ...args);
            };
            Object.defineProperty(provider, 'request', {
                value: reques_dbg
            });
        }
        this.__provider = provider;
    }
    private get _selectedAddress(): Address | null {
        return this.__selectedAddress;
    }
    private set _selectedAddress(value: Address | null) {
        if (ROParams.debug > 1) {
            console.debug('[Blockchain.selected-address]', value);
        }
        this.__selectedAddress = value;
    }
    private get _isInstalled(): boolean | undefined {
        return this.__isInstalled;
    }
    private set _isInstalled(value: boolean | undefined) {
        if (ROParams.debug > 1) {
            console.debug('[Blockchain.is-installed]', value);
        }
        this.__isInstalled = value;
    }
    private get _isConnected(): boolean | undefined {
        return this.__isConnected;
    }
    private set _isConnected(value: boolean | undefined) {
        if (ROParams.debug > 1) {
            console.debug('[Blockchain.is-connected]', value);
        }
        this.__isConnected = value;
    }
    private get _chainId(): ChainId | undefined {
        return this.__chainId;
    }
    private set _chainId(value: ChainId | undefined) {
        if (ROParams.debug > 1) {
            console.debug('[Blockchain.chain-id]', value);
        }
        this.__chainId = value;
    }
    private __selectedAddress: Address | null = null;
    private __isInstalled: boolean | undefined;
    private __isConnected: boolean | undefined;
    private __provider: Provider | undefined;
    private __chainId: ChainId | undefined;
    private static _me: any;
}
export default Blockchain;
