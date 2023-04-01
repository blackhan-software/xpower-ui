import { ContractInterface, Transaction } from 'ethers';
import { x40, x64 } from '../../functions';
import { ROParams } from '../../params';
import { Address, BlockHash, Nonce } from '../../redux/types';
import { Version } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './xpower-moe.abi.json';

export class XPowerMoe extends Base {
    public constructor(
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
    async init(): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
        return contract.init();
    }
    async mint(
        to: Address, block_hash: BlockHash, nonce: Nonce
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
        if (ROParams.version < Version.v3a && !ROParams.versionFaked) {
            return contract['mint(uint256,bytes32)'](
                x64(nonce), x64(block_hash)
            );
        }
        return contract['mint(address,bytes32,uint256)'](
            x40(to), x64(block_hash), x64(nonce), { gasLimit: 250_000 }
        );
    }
}
export default XPowerMoe;
