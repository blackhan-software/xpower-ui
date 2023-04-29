import { MYProvider } from '../blockchain';
import { XPowerSov, XPowerSovFactory } from '../contract';
import { Account, Address, Token } from '../redux/types';
import { Version } from '../types';
import { ERC20Wallet } from './erc20-wallet';

export class SovWallet extends ERC20Wallet {
    constructor(
        account: Account | Address, token: Token, version?: Version
    ) {
        super(account);
        this._sov = XPowerSovFactory({ token, version });
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
