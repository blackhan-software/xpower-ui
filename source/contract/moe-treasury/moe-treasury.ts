import { InterfaceAbi, Listener, Transaction } from 'ethers';
import { MYProvider } from '../../blockchain';
import { x40 } from '../../functions';
import { ROParams } from '../../params';
import { Account, Address, Amount, Index, Nft, NftFullId, NftRealId, Rate } from '../../redux/types';
import { TxEvent, Version, VersionAt } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './moe-treasury.abi.json';

export type OnClaim = (
    account: Account,
    nftId: NftFullId,
    amount: Amount,
    ev: TxEvent
) => void;
export type OnClaimBatch = (
    account: Account,
    nftIds: NftFullId[],
    amounts: Amount[],
    ev: TxEvent
) => void;
export type OnRefresh = (
    allLevels: boolean,
    ev: TxEvent
) => void;

export type APR = {
    stamp: bigint;
    value: bigint;
    area: bigint;
};
export type APB = {
    stamp: bigint;
    value: bigint;
    area: bigint;
};

export class MoeTreasury extends Base {
    public constructor(
        address: Address, version = ROParams.version,
        abi: InterfaceAbi = ABI
    ) {
        if (ROParams.lt2(version, VersionAt(-1))) {
            abi = require(`./moe-treasury.abi.${version}.json`);
        }
        super(address, abi);
        this.version = version;
    }
    public async aprs(
        ppt_id: NftFullId, index: Index
    ): Promise<APR> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        return contract.aprs(id, index).then(
            ([stamp, value, area]: Rate[]) => ({ stamp, value, area })
        );
    }
    public async aprsLength(
        ppt_id: NftFullId
    ): Promise<number | undefined> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v7b)) {
            return undefined;
        }
        return contract.aprsLength(id);
    }
    public async apbs(
        ppt_id: NftFullId, index: Index
    ): Promise<APB> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.bonuses(id, index).then(
                ([stamp, value, area]: Rate[]) => ({ stamp, value, area })
            );
        }
        return contract.apbs(id, index).then(
            ([stamp, value, area]: Rate[]) => ({ stamp, value, area })
        );
    }
    public async apbsLength(
        ppt_id: NftFullId
    ): Promise<number | undefined> {
        if (ROParams.lt2(this.version, Version.v7b)) {
            return undefined;
        }
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.bonusesLength(id);
        }
        return contract.apbsLength(id);
    }
    public async claim(
        address: Account, ppt_id: NftFullId
    ): Promise<Transaction> {
        const contract = await this.otf;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.claimFor(x40(address), id);
        }
        return contract.claim(x40(address), id);
    }
    public async claimBatch(
        address: Account, ppt_ids: NftFullId[]
    ): Promise<Transaction> {
        const contract = await this.otf;
        const ids = Nft.realIds(ppt_ids, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.claimForBatch(x40(address), ids);
        }
        return contract.claimBatch(x40(address), ids);
    }
    public async claimed(
        address: Account, ppt_id: NftFullId
    ): Promise<Amount> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.claimedFor(x40(address), id);
        }
        return contract.claimed(x40(address), id);
    }
    public async claimedBatch(
        address: Account, ppt_ids: NftFullId[]
    ): Promise<Amount[]> {
        const contract = await this.get;
        const ids = Nft.realIds(ppt_ids, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.claimedForBatch(x40(address), ids);
        }
        return contract.claimedBatch(x40(address), ids);
    }
    public async claimable(
        address: Account, ppt_id: NftFullId
    ): Promise<Amount> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.claimableFor(x40(address), id);
        }
        return contract.claimable(x40(address), id);
    }
    public async claimableBatch(
        address: Account, ppt_ids: NftFullId[]
    ): Promise<Amount[]> {
        const contract = await this.get;
        const ids = Nft.realIds(ppt_ids, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.claimableForBatch(x40(address), ids);
        }
        return contract.claimableBatch(x40(address), ids);
    }
    public async aprOf(
        ppt_id: NftFullId
    ): Promise<Rate> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        return contract.aprOf(id);
    }
    public async apbOf(
        ppt_id: NftFullId
    ): Promise<Rate> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.aprBonusOf(id);
        }
        return contract.apbOf(id);
    }
    public async aprTargetOf(
        ppt_id: NftFullId
    ): Promise<Rate> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v6b)) {
            return 0n;
        }
        return contract.aprTargetOf(id);
    }
    public async apbTargetOf(
        ppt_id: NftFullId
    ): Promise<Rate> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v6b)) {
            return 0n;
        }
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.aprBonusTargetOf(id);
        }
        return contract.apbTargetOf(id);
    }
    public async onBlock(
        listener: Listener
    ): Promise<void> {
        const provider = await MYProvider();
        provider?.on('block', listener);
    }
    public async onClaim(
        listener: OnClaim
    ): Promise<void> {
        const contract = await this.get;
        contract.on('Claim', (
            account: string, id: bigint, amount: Amount, ev: TxEvent
        ) => {
            const nft_id = Nft.fullIdOf({
                real_id: id.toString() as NftRealId
            });
            listener(BigInt(account), nft_id, amount, ev);
        });
    }
    public async onClaimBatch(
        listener: OnClaimBatch
    ): Promise<void> {
        const contract = await this.get;
        contract.on('ClaimBatch', (
            account: string, ids: bigint[], amounts: Amount[], ev: TxEvent
        ) => {
            const nft_ids = Nft.fullIdsOf({
                real_ids: ids.map((id) => id.toString() as NftRealId)
            });
            listener(BigInt(account), nft_ids, amounts, ev);
        });
    }
    public async refreshRates(
        all_levels: boolean
    ): Promise<Transaction> {
        const contract = await this.otf;
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.refreshRates(2, all_levels);
        }
        return contract.refreshRates(all_levels);
    }
    public async refreshable(): Promise<boolean> {
        const contract = await this.get;
        if (ROParams.lt2(this.version, Version.v8a)) {
            return contract.refreshable(2);
        }
        return contract.refreshable();
    }
    public async onRefreshRates(
        listener: OnRefresh
    ): Promise<void> {
        const contract = await this.get;
        if (ROParams.lt2(this.version, Version.v7c)) {
            return;
        }
        if (ROParams.lt2(this.version, Version.v8a)) {
            contract.on('RefreshRates', listener);
            return;
        }
        contract.on('RefreshRates', (
            all_levels: boolean, ev: TxEvent
        ) => {
            listener(all_levels, ev);
        });
    }
    private get otf() {
        return OtfManager.connect(this.connect());
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
    private version: Version;
}
export default MoeTreasury;
