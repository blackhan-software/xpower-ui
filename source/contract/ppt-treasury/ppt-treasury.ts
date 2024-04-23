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
    constructor(
        address: Address, version = ROParams.version,
        abi: InterfaceAbi = ABI
    ) {
        if (ROParams.lt2(version, VersionAt(-1))) {
            abi = require(`./ppt-treasury.abi.${version}.json`);
        }
        super(address, abi);
        this.version = version;
    }
    async stake(
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
    async unstake(
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
    async stakeBatch(
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
    async unstakeBatch(
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
    async onStake(
        listener: OnStake, { once } = { once: false }
    ): Promise<void> {
        const on_stake = (
            account: string,
            id: bigint,
            amount: Amount,
            ev: TxEvent
        ) => {
            const address = BigInt(account);
            const nft_id = id.toString() as NftFullId;
            listener(address, nft_id, amount, ev);
        }
        if (once) {
            await this.get.then((c) => c.once('Stake', on_stake));
        } else {
            await this.get.then((c) => c.on('Stake', on_stake));
        }
    }
    async offStake(
        listener: OnStake
    ): Promise<void> {
        await this.get.then((c) => c.off('Stake', listener));
    }
    async onUnstake(
        listener: OnUnstake, { once } = { once: false }
    ): Promise<void> {
        const on_unstake = (
            account: string,
            id: bigint,
            amount: Amount,
            ev: TxEvent
        ) => {
            const address = BigInt(account);
            const nft_id = id.toString() as NftFullId;
            listener(address, nft_id, amount, ev);
        };
        if (once) {
            await this.get.then((c) => c.once('Unstake', on_unstake));
        } else {
            await this.get.then((c) => c.on('Unstake', on_unstake));
        }
    }
    async offUnstake(
        listener: OnUnstake
    ): Promise<void> {
        await this.get.then((c) => c.off('Unstake', listener));
    }
    async onStakeBatch(
        listener: OnStakeBatch, { once } = { once: false }
    ): Promise<void> {
        const on_stake = (
            account: string,
            ids: bigint[],
            amounts: Amount[],
            ev: TxEvent
        ) => {
            const nft_ids = Nft.fullIdsOf({
                real_ids: ids.map((id) => id.toString() as NftRealId)
            });
            listener(BigInt(account), nft_ids, amounts, ev);
        };
        if (once) {
            await this.get.then((c) => c.once('StakeBatch', on_stake));
        } else {
            await this.get.then((c) => c.on('StakeBatch', on_stake));
        }
    }
    async offStakeBatch(
        listener: OnStakeBatch
    ): Promise<void> {
        await this.get.then((c) => c.off('StakeBatch', listener));
    }
    async onUnstakeBatch(
        listener: OnUnstakeBatch, { once } = { once: false }
    ): Promise<void> {
        const on_unstake = (
            account: string,
            ids: bigint[],
            amounts: Amount[],
            ev: TxEvent
        ) => {
            const nft_ids = Nft.fullIdsOf({
                real_ids: ids.map((id) => id.toString() as NftRealId)
            });
            listener(BigInt(account), nft_ids, amounts, ev);
        };
        if (once) {
            await this.get.then((c) => c.once('UnstakeBatch', on_unstake));
        } else {
            await this.get.then((c) => c.on('UnstakeBatch', on_unstake));
        }
    }
    async offUnstakeBatch(
        listener: OnUnstakeBatch
    ): Promise<void> {
        await this.get.then((c) => c.off('UnstakeBatch', listener));
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
    private version: Version;
}
export default PptTreasury;
