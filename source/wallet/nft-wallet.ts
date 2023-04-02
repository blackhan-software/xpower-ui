import { Contract, Transaction } from 'ethers';
import { XPowerNft, XPowerNftFactory, XPowerNftMockFactory } from '../contract';
import { address } from '../contract/address';
import { ROParams } from '../params';
import { Address, Amount, Index, Nft, NftFullId, NftIssue, NftLevel, NftRealId, Token, Year } from '../redux/types';
import { Tokenizer } from '../token';

import { ERC1155Wallet } from './erc1155-wallet';

export class NftWallet extends ERC1155Wallet {
    constructor(
        address: Address | string, token: Token, nft?: XPowerNft
    ) {
        super(address, token);
        if (nft === undefined) {
            nft = XPowerNftFactory({ token });
        }
        this._nft = nft;
    }
    mint(
        level: NftLevel | Promise<NftLevel>,
        amount: Amount | Promise<Amount>,
    ): Promise<Transaction> {
        const moe_index = this.moeIndexOf(moeAddress(this.token));
        return this._nft.mint(
            this.address, level, amount, moe_index
        );
    }
    mintBatch(
        levels: NftLevel[] | Promise<NftLevel[]>,
        amounts: Amount[] | Promise<Amount[]>,
    ): Promise<Transaction> {
        const moe_index = this.moeIndexOf(moeAddress(this.token));
        return this._nft.mintBatch(
            this.address, levels, amounts, moe_index
        );
    }
    upgrade(
        issue: NftIssue | Promise<NftIssue>,
        level: NftLevel | Promise<NftLevel>,
        amount: Amount | Promise<Amount>,
    ): Promise<Transaction> {
        const moe_index = this.moeIndexOf(moeAddress(this.token));
        return this._nft.upgrade(
            this.address, issue, level, amount, moe_index
        );
    }
    upgradeBatch(
        issues: NftIssue[] | Promise<NftIssue[]>,
        levels: NftLevel[][] | Promise<NftLevel[][]>,
        amounts: Amount[][] | Promise<Amount[][]>,
    ): Promise<Transaction> {
        const moe_index = this.moeIndexOf(moeAddress(this.token));
        return this._nft.upgradeBatch(
            this.address, issues, levels, amounts, moe_index
        );
    }
    moeIndexOf(
        moe: Address | Promise<Address>
    ): Promise<Index> {
        return this._nft.moeIndexOf(moe);
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
            const connected = this._nft.connect();
            return connected.then((c) => (this._contract = c));
        }
        return Promise.resolve(this._contract);
    }
    private _contract: Contract | undefined;
    private _nft: XPowerNft;
}
export class NftWalletMock extends NftWallet {
    constructor(
        address: Address | string = 0n, token: Token
    ) {
        super(address, token, XPowerNftMockFactory({ token }));
    }
}
function moeAddress(
    token: Token
): Address {
    return BigInt(address({
        token: Tokenizer.xify(token),
        version: ROParams.version,
        infix: 'MOE',
    }));
}
export default NftWallet;
