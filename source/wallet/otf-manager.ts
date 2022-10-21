/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../types';
declare const global: Global;

import { Blockchain } from '../blockchain';
import { RWParams } from '../params';

import { NonceManager } from '@ethersproject/experimental';
import { Web3Provider } from '@ethersproject/providers';
import { randomBytes } from '@ethersproject/random';
import { parseUnits } from '@ethersproject/units';
import { Contract, Wallet } from 'ethers';

export class OtfManager {
    private static get me(): OtfManager {
        if (this._me === undefined) {
            this._me = new OtfManager();
        }
        return this._me;
    }
    public static get threshold() {
        return parseUnits('0.005');
    }
    public static get enabled(): boolean {
        const item = localStorage.getItem('otf-wallet:flag');
        return JSON.parse(item ?? 'false') || RWParams.otfWallet;
    }
    public static set enabled(value: boolean) {
        RWParams.otfWallet = value;
        const item = JSON.stringify(value);
        localStorage.setItem('otf-wallet:flag', item);
    }
    public static async init(
        key = 'otf-wallet'
    ): Promise<NonceManager> {
        if (this._wallet !== undefined) {
            return Promise.resolve(this._wallet);
        }
        let value = localStorage.getItem(key);
        if (value === null) {
            value = btoa(JSON.stringify(Object.values(randomBytes(32))));
            localStorage.setItem(key, value);
        }
        const provider = global.WEB3_PROVIDER_OTF = new Web3Provider(
            await Blockchain.provider
        );
        if (await Blockchain.isAvalanche()) {
            provider._pollingInterval = 600; // ms
        }
        const wallet = new Wallet(JSON.parse(atob(value)), provider);
        return this._wallet = global.OTF_WALLET = new NonceManager(wallet);
    }
    public static async connect(
        fallback: Contract
    ): Promise<Contract> {
        if (OtfManager.enabled) {
            const wallet = await OtfManager.init();
            const balance = await wallet.getBalance();
            if (balance.gt(0)) {
                return fallback.connect(wallet);
            }
        }
        return fallback;
    }
    private static _wallet: NonceManager | undefined;
    private static _me: any;
}
export default OtfManager;
