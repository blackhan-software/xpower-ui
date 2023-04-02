import { Contract } from 'ethers';
import { XPowerPpt, XPowerPptFactory, XPowerPptMockFactory } from '../contract';
import { Address, Nft, NftFullId, NftLevel, NftRealId, Token, Year } from '../redux/types';

import { ERC1155Wallet } from './erc1155-wallet';

export class PptWallet extends ERC1155Wallet {
    constructor(
        address: Address | string, token: Token, ppt?: XPowerPpt
    ) {
        super(address, token);
        if (ppt === undefined) {
            ppt = XPowerPptFactory({ token });
        }
        this._ppt = ppt;
    }
    async idBy(
        year: Year | Promise<Year>,
        level: NftLevel | Promise<NftLevel>,
    ): Promise<NftFullId> {
        const [y, l] = await Promise.all([year, level]);
        return Nft.fullIdOf({
            real_id: `${100 * y + l}` as NftRealId,
            token: this.nftToken
        });
    }
    async year(
        delta: Year | Promise<Year> = 0
    ): Promise<Year> {
        return Promise.resolve(new Date().getFullYear() - await delta);
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            const connected = this._ppt.connect();
            return connected.then((c) => (this._contract = c));
        }
        return Promise.resolve(this._contract);
    }
    protected _contract: Contract | undefined;
    protected _ppt: XPowerPpt;
}
export class PptWalletMock extends PptWallet {
    constructor(
        address: Address | string = 0n, token: Token
    ) {
        super(address, token, XPowerPptMockFactory({ token }));
    }
}
export default PptWallet;
