import { Global } from '../types';
declare const global: Global;

import { MYProvider } from '../blockchain';
import { RWParams } from '../params';
import { Balance } from '../redux/types';

import { Contract, SigningKey, Wallet, parseUnits, randomBytes } from 'ethers';
import { OtfWallet } from './otf-wallet';

export class OtfManager {
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
    ): Promise<Wallet> {
        if (this._wallet !== undefined && global.MY_PROVIDER_OTF) {
            return Promise.resolve(this._wallet);
        }
        let value = localStorage.getItem(key);
        if (value === null) {
            value = btoa(JSON.stringify(Object.values(randomBytes(32))));
            localStorage.setItem(key, value);
        }
        const secret = new Uint8Array(JSON.parse(atob(value)));
        const provider = global.MY_PROVIDER_OTF = await MYProvider();
        const wallet = new OtfWallet(new SigningKey(secret), provider);
        return this._wallet = global.OTF_WALLET = wallet;
    }
    public static async connect(
        fallback: Promise<Contract>
    ): Promise<Contract> {
        if (OtfManager.enabled) {
            const wallet = await OtfManager.init();
            const balance = await this.getBalance();
            if (balance > this.threshold) {
                return fallback.then((c) => c.connect(wallet) as Contract);
            }
        }
        return fallback;
    }
    public static async getBalance(): Promise<Balance> {
        const wallet = this._wallet;
        if (wallet) {
            const address = wallet.address;
            if (address) {
                const provider = await MYProvider();
                if (provider) {
                    return provider.getBalance(address);
                }
            }
        }
        return 0n;
    }
    private static _wallet: Wallet | undefined;
}
export default OtfManager;
