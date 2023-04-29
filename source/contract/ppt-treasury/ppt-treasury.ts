import { InterfaceAbi, Transaction } from 'ethers';
import { MYProvider } from '../../blockchain';
import { x40 } from '../../functions';
import { Account, Address, Amount, Balance, Nft, NftRealId } from '../../redux/types';
import { TxEvent } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './ppt-treasury.abi.json';

export type OnStake = (
    account: Account,
    nftId: NftRealId,
    amount: Amount,
    ev: TxEvent
) => void;
export type OnUnstake = (
    account: Account,
    nftId: NftRealId,
    amount: Amount,
    ev: TxEvent
) => void;
export type OnStakeBatch = (
    account: Account,
    nftIds: NftRealId[],
    amounts: Amount[],
    ev: TxEvent
) => void;
export type OnUnstakeBatch = (
    account: Account,
    nftIds: NftRealId[],
    amounts: Amount[],
    ev: TxEvent
) => void;

export class PptTreasury extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        super(address, abi);
    }
    public async stake(
        account: Account, nft_id: NftRealId, balance: Balance
    ): Promise<Transaction> {
        const contract = await this.otf;
        return contract.stake(
            x40(account), Nft.realId(nft_id), balance
        );
    }
    public async unstake(
        account: Account, nft_id: NftRealId, balance: Balance
    ): Promise<Transaction> {
        const contract = await this.otf;
        return contract.unstake(
            x40(account), Nft.realId(nft_id), balance
        );
    }
    public async stakeBatch(
        account: Account, nft_ids: NftRealId[], balances: Balance[]
    ): Promise<Transaction> {
        const contract = await this.otf;
        return contract.stakeBatch(
            x40(account), Nft.realIds(nft_ids), balances
        );
    }
    public async unstakeBatch(
        account: Account, nft_ids: NftRealId[], balances: Balance[]
    ): Promise<Transaction> {
        const contract = await this.otf;
        return contract.unstakeBatch(
            x40(account), Nft.realIds(nft_ids), balances
        );
    }
    public async onStake(
        listener: OnStake
    ): Promise<void> {
        const contract = await this.get;
        contract.on('Stake', (
            account: string, id: bigint, amount: Amount, ev: TxEvent
        ) => {
            const address = BigInt(account);
            const nft_id = id.toString() as NftRealId;
            listener(address, nft_id, amount, ev);
        });
    }
    public async onUnstake(
        listener: OnUnstake
    ): Promise<void> {
        const contract = await this.get;
        contract.on('Unstake', (
            account: string, id: bigint, amount: Amount, ev: TxEvent
        ) => {
            const address = BigInt(account);
            const nft_id = id.toString() as NftRealId;
            listener(address, nft_id, amount, ev);
        });
    }
    public async onStakeBatch(
        listener: OnStakeBatch
    ): Promise<void> {
        const contract = await this.get;
        contract.on('StakeBatch', (
            account: string, ids: bigint[], amounts: Amount[], ev: TxEvent
        ) => {
            const address = BigInt(account);
            const nft_ids = ids.map((id) => id.toString() as NftRealId);
            listener(address, nft_ids, amounts, ev);
        });
    }
    public async onUnstakeBatch(
        listener: OnUnstakeBatch
    ): Promise<void> {
        const contract = await this.get;
        contract.on('UnstakeBatch', (
            account: string, ids: bigint[], amounts: Amount[], ev: TxEvent
        ) => {
            const address = BigInt(account);
            const nft_ids = ids.map((id) => id.toString() as NftRealId);
            listener(address, nft_ids, amounts, ev);
        });
    }
    private get otf() {
        return OtfManager.connect(this.connect());
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
}
export default PptTreasury;
