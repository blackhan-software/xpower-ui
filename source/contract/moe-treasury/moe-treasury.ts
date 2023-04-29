import { InterfaceAbi, Listener, Transaction } from 'ethers';
import { MYProvider } from '../../blockchain';
import { x40 } from '../../functions';
import { ROParams } from '../../params';
import { Account, Address, Amount, Balance, Index, Nft, NftRealId, NftToken, Rate } from '../../redux/types';
import { TxEvent, Version } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './moe-treasury.abi.json';

export type OnClaim = (
    account: Account,
    nftId: NftRealId,
    amount: Amount,
    ev: TxEvent
) => void;
export type OnClaimBatch = (
    account: Account,
    nftIds: NftRealId[],
    amounts: Amount[],
    ev: TxEvent
) => void;

export type APR = {
    stamp: bigint;
    value: bigint;
    area: bigint;
};
export type APRBonus = {
    stamp: bigint;
    value: bigint;
    area: bigint;
};

export class MoeTreasury extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        super(address, abi);
    }
    public async aprs(
        prefix: NftToken, index: Index
    ): Promise<APR> {
        const contract = await this.get;
        return contract.aprs(prefix, index).then(
            ([stamp, value, area]: Rate[]) => ({ stamp, value, area })
        );
    }
    public async bonuses(
        prefix: NftToken, index: Index
    ): Promise<APRBonus> {
        const contract = await this.get;
        return contract.bonuses(prefix, index).then(
            ([stamp, value, area]: Rate[]) => ({ stamp, value, area })
        );
    }
    public async claimFor(
        address: Account, ppt_id: NftRealId
    ): Promise<Transaction> {
        const contract = await this.otf;
        return contract.claimFor(
            x40(address), Nft.realId(ppt_id)
        );
    }
    public async claimForBatch(
        address: Account, ppt_ids: NftRealId[]
    ): Promise<Transaction> {
        const contract = await this.otf;
        return contract.claimForBatch(
            x40(address), Nft.realIds(ppt_ids)
        );
    }
    public async claimedFor(
        address: Account, ppt_id: NftRealId
    ): Promise<Amount> {
        const contract = await this.get;
        return contract.claimedFor(
            x40(address), Nft.realId(ppt_id)
        );
    }
    public async claimedForBatch(
        address: Account, ppt_ids: NftRealId[]
    ): Promise<Amount[]> {
        const contract = await this.get;
        return contract.claimedForBatch(
            x40(address), Nft.realIds(ppt_ids)
        );
    }

    public async claimableFor(
        address: Account, ppt_id: NftRealId
    ): Promise<Amount> {
        const contract = await this.get;
        return contract.claimableFor(
            x40(address), Nft.realId(ppt_id)
        );
    }
    public async claimableForBatch(
        address: Account, ppt_ids: NftRealId[]
    ): Promise<Amount[]> {
        const contract = await this.get;
        return contract.claimableForBatch(
            x40(address), Nft.realIds(ppt_ids)
        );
    }
    public async rateOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        if (ROParams.version < Version.v6c) {
            const [apr, apr_bonus] = await Promise.all([
                this.aprOf(ppt_id), this.aprBonusOf(ppt_id)
            ]);
            return apr + apr_bonus;
        }
        const contract = await this.get;
        return contract
            .rateOf(Nft.realId(ppt_id));
    }
    public async aprOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        const contract = await this.get;
        return contract.aprOf(
            Nft.realId(ppt_id)
        );
    }
    public async aprBonusOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        const contract = await this.get;
        return contract.aprBonusOf(
            Nft.realId(ppt_id)
        );
    }
    public async rateTargetOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        const [apr, apr_bonus] = await Promise.all([
            this.aprTargetOf(ppt_id), this.aprBonusTargetOf(ppt_id)
        ]);
        return apr + apr_bonus;
    }
    public async aprTargetOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        const contract = await this.get;
        return contract.aprTargetOf(
            Nft.realId(ppt_id)
        );
    }
    public async aprBonusTargetOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        const contract = await this.get;
        return contract.aprBonusTargetOf(
            Nft.realId(ppt_id)
        );
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
            const address = BigInt(account);
            const nft_id = id.toString() as NftRealId;
            listener(address, nft_id, amount, ev);
        });
    }
    public async onClaimBatch(
        listener: OnClaimBatch
    ): Promise<void> {
        const contract = await this.get;
        contract.on('ClaimBatch', (
            account: string, ids: bigint[], amounts: Amount[], ev: TxEvent
        ) => {
            const address = BigInt(account);
            const nft_ids = ids.map((id) => id.toString() as NftRealId);
            listener(address, nft_ids, amounts, ev);
        });
    }
    public async moeBalanceOf(
        index: Index | Promise<Index>
    ): Promise<Balance> {
        const contract = await this.get;
        if (ROParams.version < Version.v6b) {
            return contract.balance();
        }
        return contract.moeBalanceOf(await index);
    }
    public async moeIndexOf(
        address: Account
    ): Promise<Index> {
        const contract = await this.get;
        return contract.moeIndexOf(x40(address)).then(
            (index: bigint) => Number(index)
        );
    }
    private get otf() {
        return OtfManager.connect(this.connect());
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
}
export default MoeTreasury;
