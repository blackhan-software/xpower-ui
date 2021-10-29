/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint no-async-promise-executor: [off] */
import { Chain, ChainId } from './chain';
import { Global } from '../types';
declare const global: Global;

import { Address } from '../redux/types';
import { EventEmitter } from 'events';

export type Token = {
    /** address that the token is at */
    address: Address,
    /** ticker symbol or shorthand, up to 5 chars */
    symbol: string,
    /** number of decimals in the token */
    decimals: number,
    /** string url of the token logo */
    image?: string
};

export class Blockchain extends EventEmitter {
    public static get me(): Blockchain {
        if (this._me === undefined) {
            this._me = new Blockchain();
        }
        return this._me;
    }
    private constructor() {
        super();
        if (this.provider) {
            this.provider.on('chainChanged', () => {
                window.location.reload();
            });
            this.provider.on('accountsChanged', () => {
                window.location.reload();
            });
        }
    }
    public get provider(): any {
        return global.ethereum;
    }
    public isInstalled(): boolean {
        return typeof this.provider !== 'undefined';
    }
    public isConnected(): boolean {
        return this.provider.isConnected();
    }
    public async connect(index = 0): Promise<string> {
        const addresses = await this.provider.request({
            method: 'eth_requestAccounts'
        });
        if (!addresses.length) {
            throw new Error('missing addresses');
        }
        if (addresses.length <= index) {
            throw new Error('missing address');
        }
        if (this.connect_emitted === undefined) {
            this.connect_emitted = this.emit('connect', {
                chainId: await this.chainId
            });
        }
        return addresses[index];
    }
    public get selectedAddress(): Address {
        const address = this.provider.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        return address as Address;
    }
    public async isAvalanche(): Promise<boolean> {
        const id = await this.chainId;
        if (id === ChainId.AVALANCHE_MAINNET) {
            return true;
        }
        if (id === ChainId.AVALANCHE_FUJI) {
            return true;
        }
        if (id === ChainId.AVALANCHE_LOCAL) {
            return true;
        }
        return false;
    }
    public async switchTo(id: ChainId): Promise<void> {
        const chain = new Chain(id);
        await this.provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: chain.id,
                chainName: chain.name,
                nativeCurrency: chain.currency,
                rpcUrls: chain.rpcUrls,
                blockExplorerUrls: chain.explorerUrls
            }]
        });
    }
    public async addToken(token: Token): Promise<boolean> {
        try {
            return await this.provider.request({
                method: 'wallet_watchAsset', params: {
                    type: 'ERC20', options: token
                }
            });
        } catch (ex) {
            console.error(ex);
        }
        return false;
    }
    private get chainId() {
        return new Promise<string | undefined>(async (resolve) => {
            if (this.provider) try {
                const chain_id = await this.provider.request({
                    method: 'eth_chainId'
                });
                if (chain_id && chain_id.length) {
                    resolve(`0x${parseInt(chain_id).toString(16)}`);
                } else {
                    resolve(undefined);
                }
            } catch (ex) {
                resolve(undefined);
            } else {
                resolve(undefined);
            }
        });
    }
    private get connect_emitted(): boolean | undefined {
        return this._connect_emitted;
    }
    private set connect_emitted(value: boolean | undefined) {
        this._connect_emitted = value;
    }
    private _connect_emitted: boolean | undefined;
    private static _me: any;
}
export default Blockchain;
