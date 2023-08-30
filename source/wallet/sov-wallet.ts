import { MYProvider } from '../blockchain';
import { XPowerSov, XPowerSovFactory } from '../contract';
import { Account, Address, Collat } from '../redux/types';
import { Version } from '../types';
import { ERC20Wallet } from './erc20-wallet';

export class SovWallet extends ERC20Wallet {
    constructor(
        account: Account | Address, version?: Version
    ) {
        super(account);
        if (version) {
            this._sov = XPowerSovFactory({ version });
        } else {
            this._sov = XPowerSovFactory();
        }
    }
    get collat(): Promise<Collat> {
        return this._sov.collat();
    }
    get put() {
        return this._sov.connect();
    }
    get get() {
        return MYProvider().then((p) => this._sov.connect(p));
    }
    private _sov: XPowerSov;
}
export default SovWallet;
