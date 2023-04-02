import { ContractInterface, Transaction } from 'ethers';
import { x40 } from '../../functions';
import { ROParams } from '../../params';
import { Address, Amount, Index, NftIssue, NftLevel } from '../../redux/types';
import { Version } from '../../types';
import { OtfManager } from '../../wallet';

import { Base } from '../base';
import ABI from './xpower-nft.abi.json';

export class XPowerNft extends Base {
    public constructor(
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
    async mint(
        to: Address | Promise<Address>,
        level: NftLevel | Promise<NftLevel>,
        amount: Amount | Promise<Amount>,
        moe_index: Index | Promise<Index>
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
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
        to: Address | Promise<Address>,
        levels: NftLevel[] | Promise<NftLevel[]>,
        amounts: Amount[] | Promise<Amount[]>,
        moe_index: Index | Promise<Index>,
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
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
    async upgrade(
        to: Address | Promise<Address>,
        issue: NftIssue | Promise<NftIssue>,
        level: NftLevel | Promise<NftLevel>,
        amount: Amount | Promise<Amount>,
        moe_index: Index | Promise<Index>,
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
        return contract['upgrade(address,uint256,uint256,uint256,uint256)'](
            x40(await to), issue, level, amount, moe_index
        );
    }
    async upgradeBatch(
        to: Address | Promise<Address>,
        issues: NftIssue[] | Promise<NftIssue[]>,
        levels: NftLevel[][] | Promise<NftLevel[][]>,
        amounts: Amount[][] | Promise<Amount[][]>,
        moe_index: Index | Promise<Index>,
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
        return contract['upgradeBatch(address,uint256[],uint256[][],uint256[][],uint256)'](
            x40(await to), issues, levels, amounts, moe_index
        );
    }
    async moeIndexOf(
        moe: Address | Promise<Address>
    ): Promise<Index> {
        if (ROParams.version < Version.v6a && !ROParams.versionFaked) {
            return Promise.resolve(-1); // invalid moe-index!
        }
        const contract = await this.connect();
        return contract['moeIndexOf(address)'](x40(await moe));
    }
}
export default XPowerNft;
