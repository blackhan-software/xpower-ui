/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint no-async-promise-executor: [off] */

import { hostAt, x40 } from '../functions';
import { inIframe } from '../functions/in-iframe';
import { ROParams, RWParams } from '../params';
import { Account, Token, TokenInfo, XTokens } from '../redux/types';
import { Version } from '../types';
import { Chain, ChainId } from './chain';

import detectProvider from '@metamask/detect-provider';
import { EventEmitter } from 'events';

export type Provider = Awaited<ReturnType<typeof detectProvider>> & {
    isConnected: () => Promise<boolean>;
    request: (...args: any[]) => any;
} & EventEmitter;
export type Connect = {
    accounts: Account[];
    account: Account;
    chainId: ChainId;
    token: Token;
    version: Version;
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
    public static get provider(): Promise<Provider | undefined> {
        return this.me.provider();
    }
    private async provider(): Promise<Provider | undefined> {
        if (this._provider === undefined || this._provider === null) {
            const { SAProvider } = await import('./sa-provider');
            const provider = await select(
                detectProvider(), SAProvider()
            );
            this._provider = provider;
        }
        return this._provider;
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
                async (p) => Boolean(await p?.isConnected())
            );
        }
        return Boolean(this._isConnected);
    }
    public static async reconnect(): Promise<Account[]> {
        return this.me.reconnect();
    }
    public async reconnect(): Promise<Account[]> {
        const accounts = await this.accountsOf();
        if (!accounts.length) {
            throw new Error('missing accounts');
        }
        const account = await this.accountOf(accounts);
        if (!account) {
            throw new Error('missing account');
        }
        setTimeout(async () => {
            this.emit('reconnect', {
                accounts, account,
                chainId: await this.chainId(),
                token: RWParams.token,
                version: ROParams.version
            });
        });
        return accounts;
    }
    public static async connect(): Promise<Account[]> {
        return this.me.connect();
    }
    private async connect(): Promise<Account[]> {
        const accounts: Account[] = await this.provider()
            .then((p) => p?.request({ method: 'eth_requestAccounts' }))
            .then((a?: string[]) => a?.map((v) => BigInt(v)))
            .then((a?: bigint[]) => a ?? [])
            .catch(() => this.accountsOf());
        const account = this.accountOf(accounts);
        if (!account) {
            throw new Error('missing account');
        }
        setTimeout(async () => {
            this.emit('connect', {
                accounts, account,
                chainId: await this.chainId(),
                token: RWParams.token,
                version: ROParams.version
            });
        });
        return accounts;
    }
    public static set account(value: Account | null) {
        const old_value = RWParams.account;
        RWParams.account = value;
        if (old_value !== null &&
            old_value !== value
        ) {
            location.reload();
        }
    }
    public static get account(): Promise<Account | null> {
        return this.me.accountsOf().then((a) => this.me.accountOf(a));
    }
    private accountOf(accounts: Account[]): Account | null {
        const account = RWParams.account;
        if (account !== null) {
            return account; // ro|rw
        }
        if (accounts.length) {
            return accounts[0];
        }
        return null;
    }
    private async accountsOf(): Promise<Account[]> {
        if (this._accounts === undefined && this._provider) {
            this._accounts = await this.provider()
                .then((p) => p?.request({ method: 'eth_accounts' }))
                .then((a?: string[]) => a?.map((v) => BigInt(v)));
        }
        return this._accounts ?? [];
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
    public static async isMainnet(): Promise<boolean> {
        return this.me.isMainnet();
    }
    private async isMainnet(): Promise<boolean> {
        const id = await this.chainId();
        if (id === ChainId.AVALANCHE_MAINNET) {
            return true;
        }
        return false;
    }
    public static async isTestnet(): Promise<boolean> {
        return this.me.isTestnet();
    }
    private async isTestnet(): Promise<boolean> {
        const id = await this.chainId();
        if (id === ChainId.AVALANCHE_FUJI) {
            return true;
        }
        return false;
    }
    public static async isHardhat(): Promise<boolean> {
        return this.me.isHardhat();
    }
    private async isHardhat(): Promise<boolean> {
        const id = await this.chainId();
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
        // await this.provider().then((p) => p?.request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{
        //         chainId: chain.id,
        //     }]
        // }));
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
        this.on('reconnect', listener)
            .on('connect', listener);
        return () => {
            this.off('reconnect', listener)
                .off('connect', listener);
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
            this.on('reconnect', listener)
                .once('connect', listener);
            return () => {
                this.off('reconnect', listener)
                    .off('connect', listener);
            };
        }
        if (context.tokens === undefined) {
            context.tokens = new Set(XTokens());
        }
        const handlers = [] as Array<(options: Connect) => void>;
        for (const token of context.tokens) {
            const handler = (options: Connect) => {
                if (token === context.per()) {
                    this.off('reconnect', handler)
                        .off('connect', handler);
                    listener(options);
                }
            };
            this.on('reconnect', handler)
                .on('connect', handler);
            handlers.push(handler);
        }
        return () => {
            handlers.forEach((handler) => {
                this.off('reconnect', handler)
                    .off('connect', handler);
            });
        };
    }
    public static chainId(): Promise<ChainId | undefined> {
        return this.me.chainId();
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
    private get _accounts(): Account[] | undefined {
        return this.__accounts;
    }
    private set _accounts(value: Account[] | undefined) {
        if (ROParams.debug > 1) {
            console.debug('[Blockchain.accounts]', value);
        }
        this.__accounts = value;
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
    private __accounts: Account[] | undefined;
    private __isInstalled: boolean | undefined;
    private __isConnected: boolean | undefined;
    private __provider: Provider | undefined;
    private __chainId: ChainId | undefined;
    private static _me: any;
}
function select(
    mm_provider: Promise<Provider | undefined | null>,
    sa_provider: Promise<Provider | undefined | null>,
) {
    return (hostAt(/^safe/) || inIframe())
        ? sa_provider.then((p) => p ?? undefined)
        : mm_provider.then((p) => p ?? undefined);
}
export default Blockchain;
