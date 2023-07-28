import { InterfaceAbi, Transaction } from 'ethers';
import { x40 } from '../../functions';
import { ROParams } from '../../params';
import { Account, Address, Amount, Index, NftIssue, NftLevel, NftRealId } from '../../redux/types';
import { Version, VersionAt } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './xpower-nft.abi.json';

export class XPowerNft extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        if (ROParams.version < VersionAt(-1) && !ROParams.versionFaked) {
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
        if (ROParams.version < Version.v2b && !ROParams.versionFaked) {
            return contract['mint(uint256,uint256)'](
                level, amount
            );
        }
        if (ROParams.version < Version.v6a && !ROParams.versionFaked) {
            return contract['mint(address,uint256,uint256)'](
                x40(await to), level, amount
            );
        }
        return contract['mint(address,uint256,uint256,uint256)'](
            x40(await to), level, amount, moe_index
        );
    }
    async mintBatch(
        to: Account | Promise<Account>,
        levels: NftLevel[] | Promise<NftLevel[]>,
        amounts: Amount[] | Promise<Amount[]>,
        moe_index: Index | Promise<Index>,
    ): Promise<Transaction> {
        const contract = await this.otf;
        if (ROParams.version < Version.v2b && !ROParams.versionFaked) {
            return contract['mintBatch(uint256[],uint256[])'](
                levels, amounts
            );
        }
        if (ROParams.version < Version.v6a && !ROParams.versionFaked) {
            return contract['mintBatch(address,uint256[],uint256[])'](
                x40(await to), levels, amounts
            );
        }
        return contract['mintBatch(address,uint256[],uint256[],uint256)'](
            x40(await to), levels, amounts, moe_index
        );
    }
    async burn(
        from: Account | Promise<Account>,
        id: NftRealId | Promise<NftRealId>,
        amount: Amount | Promise<Amount>,
    ): Promise<Transaction> {
        const contract = await this.connect();
        return contract['burn(address,uint256,uint256)'](
            x40(await from), id, amount
        );
    }
    async burnBatch(
        from: Account | Promise<Account>,
        ids: NftRealId[] | Promise<NftRealId[]>,
        amounts: Amount[] | Promise<Amount[]>,
    ): Promise<Transaction> {
        const contract = await this.connect();
        return contract['burnBatch(address,uint256[],uint256[])'](
            x40(await from), ids, amounts
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
        return contract['upgrade(address,uint256,uint256,uint256,uint256)'](
            x40(await to), issue, level, amount, moe_index
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
        return contract[
            'upgradeBatch(address,uint256[],uint256[][],uint256[][],uint256)'
        ](
            x40(await to), issues, levels, amounts, moe_index
        );
    }
    async moeIndexOf(
        moe: Account | Promise<Account>
    ): Promise<Index> {
        if (ROParams.version < Version.v6a && !ROParams.versionFaked) {
            return Promise.resolve(-1); // invalid moe-index!
        }
        const contract = await this.connect();
        return contract['moeIndexOf(address)'](x40(await moe));
    }
    private get otf() {
        return OtfManager.connect(this.connect());
    }
}
export default XPowerNft;
