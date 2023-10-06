import { InterfaceAbi, Transaction } from 'ethers';
import { MYProvider } from '../../blockchain';
import { x40 } from '../../functions';
import { ROParams } from '../../params';
import { Account, Address, Amount, Balance, Nft, NftFullId, NftRealId } from '../../redux/types';
import { TxEvent, Version, VersionAt } from '../../types';
import { Base } from '../base';

import ABI from './ppt-treasury.abi.json';

export type OnStake = (
    account: Account,
    nftId: NftFullId,
    amount: Amount,
    ev: TxEvent
) => void;
export type OnUnstake = (
    account: Account,
    nftId: NftFullId,
    amount: Amount,
    ev: TxEvent
) => void;
export type OnStakeBatch = (
    account: Account,
    nftIds: NftFullId[],
    amounts: Amount[],
    ev: TxEvent
) => void;
export type OnUnstakeBatch = (
    account: Account,
    nftIds: NftFullId[],
    amounts: Amount[],
    ev: TxEvent
) => void;

export class PptTreasury extends Base {
    public constructor(
        address: Address, version = ROParams.version,
        abi: InterfaceAbi = ABI
    ) {
        if (ROParams.lt2(version, VersionAt(-1))) {
            abi = require(`./ppt-treasury.abi.${version}.json`);
        }
        super(address, abi);
        this.version = version;
    }
    public async stake(
        account: Account, nft_id: NftFullId, balance: Balance
    ): Promise<Transaction> {
        const contract = await this.connect();
        const id = Nft.realId(nft_id, {
            version: this.version
        });
        return contract.stake(
            x40(account), id, balance
        );
    }
    public async unstake(
        account: Account, nft_id: NftFullId, balance: Balance
    ): Promise<Transaction> {
        const contract = await this.connect();
        const id = Nft.realId(nft_id, {
            version: this.version
        });
        return contract.unstake(
            x40(account), id, balance
        );
    }
    public async stakeBatch(
        account: Account, nft_ids: NftFullId[], balances: Balance[]
    ): Promise<Transaction> {
        const contract = await this.connect();
        const ids = Nft.realIds(nft_ids, {
            version: this.version
        });
        return contract.stakeBatch(
            x40(account), ids, balances
        );
    }
    public async unstakeBatch(
        account: Account, nft_ids: NftFullId[], balances: Balance[]
    ): Promise<Transaction> {
        const contract = await this.connect();
        const ids = Nft.realIds(nft_ids, {
            version: this.version
        });
        return contract.unstakeBatch(
            x40(account), ids, balances
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
            const nft_id = id.toString() as NftFullId;
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
            const nft_id = id.toString() as NftFullId;
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
            const nft_ids = Nft.fullIdsOf({
                real_ids: ids.map((id) => id.toString() as NftRealId)
            });
            listener(BigInt(account), nft_ids, amounts, ev);
        });
    }
    public async onUnstakeBatch(
        listener: OnUnstakeBatch
    ): Promise<void> {
        const contract = await this.get;
        contract.on('UnstakeBatch', (
            account: string, ids: bigint[], amounts: Amount[], ev: TxEvent
        ) => {
            const nft_ids = Nft.fullIdsOf({
                real_ids: ids.map((id) => id.toString() as NftRealId)
            });
            listener(BigInt(account), nft_ids, amounts, ev);
        });
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
    private version: Version;
}
export default PptTreasury;
