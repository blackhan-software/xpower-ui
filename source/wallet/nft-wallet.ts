import { BigNumber, Contract, Transaction } from 'ethers';
import { XPowerNftFactory, XPowerNftMockFactory } from '../contract';
import address from '../contract/address';
import { ROParams } from '../params';
import { Address, Amount, Nft, NftFullId, NftLevel, NftRealId, Token, Year } from '../redux/types';
import Tokenizer from '../token';
import { Version } from '../types';

import { ERC1155Wallet } from './erc1155-wallet';
import { OtfManager } from './otf-manager';

export class NftWallet extends ERC1155Wallet {
    constructor(
        address: Address | string, token: Token
    ) {
        super(address, token);
    }
    async mint(
        level: NftLevel, amount: Amount
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.contract
        );
        if (ROParams.version < Version.v2b && !ROParams.versionFaked) {
            return contract['mint(uint256,uint256)'](
                level, amount
            );
        }
        if (ROParams.version < Version.v6a && !ROParams.versionFaked) {
            return contract['mint(address,uint256,uint256)'](
                this._address, level, amount
            );
        }
        const moe_address = address({
            token: Tokenizer.xify(this._token),
            version: ROParams.version,
            infix: 'MOE',
        });
        return contract['mint(address,uint256,uint256,uint256)'](
            this._address, level, amount, contract.moeIndexOf(moe_address)
        );
    }
    async mintBatch(
        levels: NftLevel[], amounts: Amount[]
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.contract
        );
        if (ROParams.version < Version.v2b && !ROParams.versionFaked) {
            return contract['mintBatch(uint256[],uint256[])'](
                levels, amounts
            );
        }
        if (ROParams.version < Version.v6a && !ROParams.versionFaked) {
            return contract['mintBatch(address,uint256[],uint256[])'](
                this._address, levels, amounts
            );
        }
        const moe_address = address({
            token: Tokenizer.xify(this._token),
            version: ROParams.version,
            infix: 'MOE',
        });
        return contract['mintBatch(address,uint256[],uint256[],uint256)'](
            this._address, levels, amounts, contract.moeIndexOf(moe_address)
        );
    }
    async upgrade(
        issue: NftLevel, level: NftLevel, amount: Amount
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.contract
        );
        const moe_address = address({
            token: Tokenizer.xify(this._token),
            version: ROParams.version,
            infix: 'MOE',
        });
        return contract['upgrade(address,uint256,uint256,uint256,uint256)'](
            this._address, issue, level, amount, contract.moeIndexOf(moe_address)
        );
    }
    async upgradeBatch(
        issues: NftLevel[], levels: NftLevel[][], amounts: Amount[][]
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.contract
        );
        const moe_address = address({
            token: Tokenizer.xify(this._token),
            version: ROParams.version,
            infix: 'MOE',
        });
        return contract['upgradeBatch(address,uint256[],uint256[][],uint256[][],uint256)'](
            this._address, issues, levels, amounts, contract.moeIndexOf(moe_address)
        );
    }
    async idBy(
        year: Year, level: NftLevel
    ): Promise<NftFullId> {
        return Nft.fullIdOf({
            real_id: `${100 * year + level}` as NftRealId,
            token: this._nftToken
        });
    }
    async year(
        delta_years: number
    ): Promise<Year> {
        const year: BigNumber = await this.contract.then((c) => {
            return c?.year();
        });
        return year.sub(delta_years).toNumber();
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            return XPowerNftFactory({
                token: this._token
            }).then((c) => {
                return this._contract = c;
            });
        }
        return Promise.resolve(this._contract);
    }
}
export class NftWalletMock extends NftWallet {
    constructor(
        address: Address | string = 0n, token: Token
    ) {
        super(address, token);
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            return XPowerNftMockFactory({
                token: this._token
            }).then((c) => {
                return this._contract = c;
            });
        }
        return Promise.resolve(this._contract);
    }
}
export default NftWallet;
