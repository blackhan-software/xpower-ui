import { MYProvider } from '../blockchain';
import { XPowerNft, XPowerNftFactory, XPowerNftMockFactory } from '../contract';
import { address } from '../contract/address';
import { ROParams } from '../params';
import { Account, Address, Amount, Index, Nft, NftFullId, NftIssue, NftLevel, NftRealId, Year } from '../redux/types';
import { Version } from '../types';
import { ERC1155Wallet } from './erc1155-wallet';

export class NftWallet extends ERC1155Wallet {
    constructor(
        account: Account | Address, version?: Version
    ) {
        super(account, version ?? ROParams.version);
        if (version) {
            this._nft = XPowerNftFactory({ version });
        } else {
            this._nft = XPowerNftFactory();
        }
    }
    mint(
        level: NftLevel | Promise<NftLevel>,
        amount: Amount | Promise<Amount>,
    ) {
        const moe_index = this.moeIndexOf(
            moeAddress()
        );
        return this._nft.mint(
            this.account, level, amount, moe_index
        );
    }
    mintBatch(
        levels: NftLevel[] | Promise<NftLevel[]>,
        amounts: Amount[] | Promise<Amount[]>,
    ) {
        const moe_index = this.moeIndexOf(
            moeAddress()
        );
        return this._nft.mintBatch(
            this.account, levels, amounts, moe_index
        );
    }
    burn(
        full_id: NftFullId | Promise<NftFullId>,
        amount: Amount | Promise<Amount>
    ) {
        return this._nft.burn(
            this.account, full_id, amount
        );
    }
    burnBatch(
        full_ids: NftFullId[] | Promise<NftFullId[]>,
        amounts: Amount[] | Promise<Amount[]>,
    ) {
        return this._nft.burnBatch(
            this.account, full_ids, amounts
        );
    }
    upgrade(
        issue: NftIssue | Promise<NftIssue>,
        level: NftLevel | Promise<NftLevel>,
        amount: Amount | Promise<Amount>,
    ) {
        const moe_index = this.moeIndexOf(
            moeAddress()
        );
        return this._nft.upgrade(
            this.account, issue, level, amount, moe_index
        );
    }
    upgradeBatch(
        issues: NftIssue[] | Promise<NftIssue[]>,
        levels: NftLevel[][] | Promise<NftLevel[][]>,
        amounts: Amount[][] | Promise<Amount[][]>,
    ) {
        const moe_index = this.moeIndexOf(
            moeAddress()
        );
        return this._nft.upgradeBatch(
            this.account, issues, levels, amounts, moe_index
        );
    }
    moeIndexOf(
        moe: Account | Promise<Account>
    ): Promise<Index> {
        return this._nft.moeIndexOf(moe);
    }
    async idBy(
        year: Year | Promise<Year>,
        level: NftLevel | Promise<NftLevel>,
    ): Promise<NftFullId> {
        const [y, l] = await Promise.all([year, level]);
        return Nft.fullIdOf({
            real_id: `${100 * y + l}` as NftRealId
        });
    }
    async year(
        delta: Year | Promise<Year> = 0
    ): Promise<Year> {
        return Promise.resolve(new Date().getFullYear() - (await delta));
    }
    get put() {
        return this._nft.connect();
    }
    get get() {
        return MYProvider().then((p) => this._nft.connect(p));
    }
    protected _nft: XPowerNft;
}
export class NftWalletMock extends NftWallet {
    constructor(
        address: Account | Address = 0n, version?: Version
    ) {
        super(address, version);
        this._nft = XPowerNftMockFactory();
    }
}
function moeAddress(): Account {
    return BigInt(address({ version: ROParams.version, infix: 'MOE', }));
}
export default NftWallet;
