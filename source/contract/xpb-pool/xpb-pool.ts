/* eslint @typescript-eslint/no-require-imports: [off] */
import { InterfaceAbi, TransactionResponse } from 'ethers';
import { MYProvider } from '../../blockchain';
import { x40 } from '../../functions';
import { ROParams } from '../../params';
import { Account, Address } from '../../redux/types';
import { TxEvent, Version } from '../../types';
import { Base } from '../base';

import ABI from './xpb-pool.abi.json';

export type OnApproveSupply = (
    account: Account,
    operator: Account,
    token: Address,
    approved: boolean,
    ev: TxEvent
) => void;

export class XpbPool extends Base {
    constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        super(address, abi);
    }
    public async approvedSupply(
        user: Address, operator: Address, token: Address
    ): Promise<boolean> {
        const contract = await this.get;
        if (ROParams.lt(Version.v10a)) {
            return true;
        }
        return contract.approvedSupply(
            user, operator, token
        );
    }
    public async approveSupply(
        operator: Address, token: Address, flag: boolean
    ): Promise<TransactionResponse> {
        const contract = await this.connect();
        if (ROParams.lt(Version.v10a)) {
            return { wait: () => Promise.resolve({}) } as TransactionResponse;
        }
        return contract.approveSupply(
            operator, token, flag
        );
    }
    async onApproveSupply(
        listener: OnApproveSupply, { once } = { once: false }
    ) {
        const on_approval = (
            user: string,
            operator: string,
            token: string,
            approved: boolean,
            ev: TxEvent
        ) => {
            listener(BigInt(user), BigInt(operator), x40(BigInt(token)), approved, ev);
        };
        if (once) {
            await this.get.then((c) => c.once('ApproveSupply', on_approval));
        } else {
            await this.get.then((c) => c.on('ApproveSupply', on_approval));
        }
    }
    async offApproveSupply(
        listener: OnApproveSupply
    ) {
        await this.get.then((c) => c.off('ApproveSupply', listener));
    }
    public async blockHash(): Promise<string> {
        const contract = await this.get;
        if (ROParams.lt(Version.v10a)) {
            return `0x${'0'.repeat(64)}`;
        }
        return contract.blockHash();
    }
    public async supplyDifficultyOf(
        token: Address, amount: bigint,
    ): Promise<bigint> {
        const contract = await this.get;
        if (ROParams.lt(Version.v10a)) {
            return 0n;
        }
        return contract.supplyDifficultyOf(
            token, amount
        );
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
}
export default XpbPool;
