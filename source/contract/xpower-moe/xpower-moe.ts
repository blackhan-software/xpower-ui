/* eslint @typescript-eslint/no-require-imports: [off] */
import { InterfaceAbi, TransactionResponse } from 'ethers';
import { x40, x64 } from '../../functions';
import { HashManager } from '../../managers';
import { ROParams } from '../../params';
import { Account, Address, BlockHash, Nonce } from '../../redux/types';
import { Version, VersionAt } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './xpower-moe.abi.json';

export class XPowerMoe extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        if (ROParams.lt(VersionAt(-1))) {
            abi = require(`./xpower-moe.abi.${ROParams.version}.json`);
        }
        super(address, abi);
    }
    async init(): Promise<TransactionResponse | void> {
        const contract = await this.otf;
        if (ROParams.lt(Version.v02a)) {
            const [bh, ts] = [1n, BigInt(new Date().getTime())];
            return HashManager.set(bh, ts, {
                version: ROParams.version
            });
        }
        return contract.init(this.options);
    }
    async mint(
        to: Account, block_hash: BlockHash, nonce: Nonce
    ): Promise<TransactionResponse> {
        const contract = await this.otf;
        if (ROParams.lt(Version.v02a)) {
            return contract.mint(
                x64(BigInt(nonce)), this.options
            );
        }
        if (ROParams.lt(Version.v03a)) {
            return contract.mint(
                x64(BigInt(nonce)), x64(block_hash), this.options
            );
        }
        if (ROParams.lt(Version.v07c)) {
            return contract.mint(
                x40(to), x64(block_hash), x64(BigInt(nonce)), this.options
            );
        }
        return contract.mint(
            x40(to), x64(block_hash), nonce, this.options
        );
    }
    async approvedMigrate(
        account: Account, operator: Account
    ): Promise<boolean> {
        const contract = await this.connect();
        if (ROParams.lt(Version.v09c)) {
            return true;
        }
        return contract.approvedMigrate(
            x40(account), x40(operator)
        );
    }
    async approveMigrate(
        operator: Account, approved: boolean
    ): Promise<TransactionResponse | undefined> {
        const contract = await this.connect();
        if (ROParams.lt(Version.v09c)) {
            return undefined;
        }
        return contract.approveMigrate(
            x40(operator), approved
        );
    }
    private get otf() {
        return OtfManager.connect(this.connect());
    }
    private get options() {
        return {
            gasLimit: ROParams.gasLimit ?? 1e5,
            maxFeePerGas: ROParams.maxFeePerGas,
            maxPriorityFeePerGas: ROParams.maxPriorityFeePerGas,
        };
    }
}
export default XPowerMoe;
