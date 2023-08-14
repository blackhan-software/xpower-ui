import { InterfaceAbi, Transaction } from 'ethers';
import { x40 } from '../../functions';
import { ROParams } from '../../params';
import { Account, Address, Amount, Index, Nft, NftFullId, NftIssue, NftLevel } from '../../redux/types';
import { Version, VersionAt } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './xpower-nft.abi.json';

export class XPowerNft extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        if (ROParams.lt(VersionAt(-1))) {
            abi = require(`./xpower-nft.abi.${ROParams.version}.json`);
        }
        super(address, abi);
    }
    async mint(
        to: Account | Promise<Account>,
        level: NftLevel | Promise<NftLevel>,
        amount: Amount | Promise<Amount>,
        moe_index: Index | Promise<Index>
    ): Promise<Transaction> {
        const contract = await this.otf;
        if (ROParams.lt(Version.v2b)) {
            return contract.mint(
                level, amount
            );
        }
        if (ROParams.lt(Version.v6a)) {
            return contract.mint(
                x40(await to), level, amount
            );
        }
        if (ROParams.lt(Version.v8a)) {
            return contract.mint(
                x40(await to), level, amount, moe_index
            );
        }
        return contract.mint(
            x40(await to), level, amount
        );
    }
    async mintBatch(
        to: Account | Promise<Account>,
        levels: NftLevel[] | Promise<NftLevel[]>,
        amounts: Amount[] | Promise<Amount[]>,
        moe_index: Index | Promise<Index>,
    ): Promise<Transaction> {
        const contract = await this.otf;
        if (ROParams.lt(Version.v2b)) {
            return contract.mintBatch(
                levels, amounts
            );
        }
        if (ROParams.lt(Version.v6a)) {
            return contract.mintBatch(
                x40(await to), levels, amounts
            );
        }
        if (ROParams.lt(Version.v8a)) {
            return contract.mintBatch(
                x40(await to), levels, amounts, moe_index
            );
        }
        return contract.mintBatch(
            x40(await to), levels, amounts
        );
    }
    async burn(
        from: Account | Promise<Account>,
        id: NftFullId | Promise<NftFullId>,
        amount: Amount | Promise<Amount>,
    ): Promise<Transaction> {
        const contract = await this.connect();
        return contract.burn(
            x40(await from), Nft.realId(await id), amount
        );
    }
    async burnBatch(
        from: Account | Promise<Account>,
        ids: NftFullId[] | Promise<NftFullId[]>,
        amounts: Amount[] | Promise<Amount[]>,
    ): Promise<Transaction> {
        const contract = await this.connect();
        return contract.burnBatch(
            x40(await from), Nft.realIds(await ids), amounts
        );
    }
    async upgrade(
        to: Account | Promise<Account>,
        issue: NftIssue | Promise<NftIssue>,
        level: NftLevel | Promise<NftLevel>,
        amount: Amount | Promise<Amount>,
        moe_index: Index | Promise<Index>,
    ): Promise<Transaction> {
        const contract = await this.otf;
        if (ROParams.lt(Version.v8a)) {
            return contract.upgrade(
                x40(await to), issue, level, amount, moe_index
            );
        }
        return contract.upgrade(
            x40(await to), issue, level, amount
        );
    }
    async upgradeBatch(
        to: Account | Promise<Account>,
        issues: NftIssue[] | Promise<NftIssue[]>,
        levels: NftLevel[][] | Promise<NftLevel[][]>,
        amounts: Amount[][] | Promise<Amount[][]>,
        moe_index: Index | Promise<Index>,
    ): Promise<Transaction> {
        const contract = await this.otf;
        if (ROParams.lt(Version.v8a)) {
            return contract.upgradeBatch(
                x40(await to), issues, levels, amounts, moe_index
            );
        }
        return contract.upgradeBatch(
            x40(await to), issues, levels, amounts
        );
    }
    async moeIndexOf(
        moe: Account | Promise<Account>
    ): Promise<Index> {
        const contract = await this.connect();
        if (ROParams.lt(Version.v6a)) {
            return Promise.resolve(-1); // invalid moe-index!
        }
        if (ROParams.lt(Version.v8a)) {
            return contract.moeIndexOf(x40(await moe));
        }
        return Promise.resolve(-1); // invalid moe-index!
    }
    private get otf() {
        return OtfManager.connect(this.connect());
    }
}
export default XPowerNft;
