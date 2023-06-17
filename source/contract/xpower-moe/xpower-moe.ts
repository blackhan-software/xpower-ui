import { InterfaceAbi, Transaction } from 'ethers';
import { hex_even, x32, x40, x64 } from '../../functions';
import { ROParams } from '../../params';
import { Account, Address, BlockHash, Nonce } from '../../redux/types';
import { Version } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './xpower-moe.abi.json';

export class XPowerMoe extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        if (ROParams.version < Version.v7c) {
            abi = require('./xpower-moe.abi.v7b.json');
        }
        super(address, abi);
    }
    async init(): Promise<Transaction> {
        const contract = await this.otf;
        return contract.init();
    }
    async mint(
        to: Account, block_hash: BlockHash, nonce: Nonce
    ): Promise<Transaction> {
        const contract = await this.otf;
        if (ROParams.version < Version.v3a && !ROParams.versionFaked) {
            return contract['mint(uint256,bytes32)'](
                x64(nonce), x64(block_hash), this.options
            );
        }
        if (ROParams.version < Version.v7c && !ROParams.versionFaked) {
            return contract['mint(address,bytes32,uint256)'](
                x40(to), x64(block_hash), x64(nonce), this.options
            );
        }
        return contract['mint(address,bytes16,bytes)'](
            x40(to), x32(block_hash), hex_even(nonce), this.options
        );
    }
    private get otf() {
        return OtfManager.connect(this.connect());
    }
    private get options() {
        return { gasLimit: 250_000 };
    }
}
export default XPowerMoe;
