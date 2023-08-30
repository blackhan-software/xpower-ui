import { MYProvider } from '../blockchain';
import { XPowerPpt, XPowerPptFactory, XPowerPptMockFactory } from '../contract';
import { ROParams } from '../params';
import { Account, Address, Nft, NftFullId, NftLevel, NftRealId, Year } from '../redux/types';
import { Version } from '../types';
import { ERC1155Wallet } from './erc1155-wallet';

export class PptWallet extends ERC1155Wallet {
    constructor(
        account: Account | Address, version?: Version
    ) {
        super(account, version ?? ROParams.version);
        if (version) {
            this._ppt = XPowerPptFactory({ version });
        } else {
            this._ppt = XPowerPptFactory();
        }
    }
    async idBy(
        year: Year | Promise<Year>,
        level: NftLevel | Promise<NftLevel>
    ): Promise<NftFullId> {
        const [y, l] = await Promise.all([year, level]);
        return Nft.fullIdOf({
            real_id: `${100 * y + l}` as NftRealId
        });
    }
    async year(
        delta: Year | Promise<Year> = 0
    ): Promise<Year> {
        return Promise.resolve(new Date().getFullYear() - await delta);
    }
    get put() {
        return this._ppt.connect();
    }
    get get() {
        return MYProvider().then((p) => this._ppt.connect(p));
    }
    protected _ppt: XPowerPpt;
}
export class PptWalletMock extends PptWallet {
    constructor(
        address: Account | Address = 0n, version?: Version
    ) {
        super(address, version);
        this._ppt = XPowerPptMockFactory();
    }
}
export default PptWallet;
