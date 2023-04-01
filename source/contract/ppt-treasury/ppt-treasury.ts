import { BigNumber, ContractInterface, Event, Transaction } from 'ethers';
import { x40 } from '../../functions';
import { Address, Amount, Balance, Nft, NftRealId } from '../../redux/types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './ppt-treasury.abi.json';

export type OnStake = (
    account: Address,
    nftId: NftRealId,
    amount: Amount,
    ev: Event
) => void;
export type OnUnstake = (
    account: Address,
    nftId: NftRealId,
    amount: Amount,
    ev: Event
) => void;
export type OnStakeBatch = (
    account: Address,
    nftIds: NftRealId[],
    amounts: Amount[],
    ev: Event
) => void;
export type OnUnstakeBatch = (
    account: Address,
    nftIds: NftRealId[],
    amounts: Amount[],
    ev: Event
) => void;

export class PptTreasury extends Base {
    public constructor(
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
    public async stake(
        account: Address, nft_id: NftRealId, balance: Balance
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
        return contract.stake(
            x40(account), Nft.realId(nft_id), balance
        );
    }
    public async unstake(
        account: Address, nft_id: NftRealId, balance: Balance
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
        return contract.unstake(
            x40(account), Nft.realId(nft_id), balance
        );
    }
    public async stakeBatch(
        account: Address, nft_ids: NftRealId[], balances: Balance[]
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
        return contract.stakeBatch(
            x40(account), Nft.realIds(nft_ids), balances
        );
    }
    public async unstakeBatch(
        account: Address, nft_ids: NftRealId[], balances: Balance[]
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            await this.connect()
        );
        return contract.unstakeBatch(
            x40(account), Nft.realIds(nft_ids), balances
        );
    }
    public async onStake(
        listener: OnStake
    ) {
        const contract = await this.connect();
        return contract.on('Stake', (
            account: string, id: BigNumber, amount: BigNumber, ev: Event
        ) => {
            const address = BigInt(account);
            const nft_id = id.toString() as NftRealId;
            listener(address, nft_id, amount.toBigInt(), ev);
        });
    }
    public async onUnstake(
        listener: OnUnstake
    ) {
        const contract = await this.connect();
        return contract.on('Unstake', (
            account: string, id: BigNumber, amount: BigNumber, ev: Event
        ) => {
            const address = BigInt(account);
            const nft_id = id.toString() as NftRealId;
            listener(address, nft_id, amount.toBigInt(), ev);
        });
    }
    public async onStakeBatch(
        listener: OnStakeBatch
    ) {
        const contract = await this.connect();
        return contract.on('StakeBatch', (
            account: string, ids: BigNumber[], amounts: BigNumber[], ev: Event
        ) => {
            const address = BigInt(account);
            const nft_ids = ids.map((id) => id.toString() as NftRealId);
            listener(address, nft_ids, amounts.map((a) => a.toBigInt()), ev);
        });
    }
    public async onUnstakeBatch(listener: OnUnstakeBatch) {
        const contract = await this.connect();
        return contract.on('UnstakeBatch', (
            account: string, ids: BigNumber[], amounts: BigNumber[], ev: Event
        ) => {
            const address = BigInt(account);
            const nft_ids = ids.map((id) => id.toString() as NftRealId);
            listener(address, nft_ids, amounts.map((a) => a.toBigInt()), ev);
        });
    }
}
export default PptTreasury;
