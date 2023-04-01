import { Contract } from 'ethers';
import { XPowerSov, XPowerSovFactory } from '../contract';
import { Address, Token } from '../redux/types';
import { ERC20Wallet } from './erc20-wallet';

export class SovWallet extends ERC20Wallet {
    constructor(
        address: Address | string, token: Token
    ) {
        super(address);
        this._sov = XPowerSovFactory({ token });
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            const connected = this._sov.connect();
            return connected.then((c) => (this._contract = c));
        }
        return Promise.resolve(this._contract);
    }
    private _contract: Contract | undefined;
    private _sov: XPowerSov;
}
export default SovWallet;
