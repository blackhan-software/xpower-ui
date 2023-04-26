import { WSProvider } from '../blockchain';
import { XPowerPpt, XPowerPptFactory, XPowerPptMockFactory } from '../contract';
import { Account, Address, Nft, NftFullId, NftLevel, NftRealId, Token, Year } from '../redux/types';
import { Version } from '../types';
import { ERC1155Wallet } from './erc1155-wallet';

export class PptWallet extends ERC1155Wallet {
    constructor(
        account: Account | Address, token: Token, version?: Version
    ) {
        super(account, token);
        this._ppt = XPowerPptFactory({ token, version });
    }
    async idBy(
        year: Year | Promise<Year>,
        level: NftLevel | Promise<NftLevel>
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
    get mmc() {
        return this._ppt.connect();
    }
    get wsc() {
        return WSProvider().then((wsp) => this._ppt.connect(wsp));
    }
    protected _ppt: XPowerPpt;
}
export class PptWalletMock extends PptWallet {
    constructor(
        address: Account | Address = 0n, token: Token, version?: Version
    ) {
        super(address, token, version);
        this._ppt = XPowerPptMockFactory({ token });
    }
}
export default PptWallet;
