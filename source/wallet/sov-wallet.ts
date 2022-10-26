import { Contract } from 'ethers';
import { XPowerSovFactory } from '../contract';
import { Address, Token } from '../redux/types';

import { ERC20Wallet } from './erc20-wallet';

export class SovWallet extends ERC20Wallet {
    constructor(
        address: Address | string, token: Token
    ) {
        super(address);
        this._token = token;
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            return XPowerSovFactory({
                token: this._token
            }).then((c) => {
                return this._contract = c;
            });
        }
        return Promise.resolve(this._contract);
    }
    protected readonly _token: Token;
}
export default SovWallet;
