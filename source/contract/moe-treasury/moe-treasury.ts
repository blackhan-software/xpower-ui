import { Listener } from '@ethersproject/providers';
import { BigNumber, ContractInterface, Event, Transaction } from 'ethers';
import { x40 } from '../../functions';
import { ROParams } from '../../params';
import { Address, Amount, Balance, Index, Nft, NftRealId, NftToken, Rate } from '../../redux/types';
import { Version } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import ABI from './moe-treasury.abi.json';

export type OnClaim = (
    account: Address,
    nftId: NftRealId,
    amount: Amount,
    ev: Event
) => void;
export type OnClaimBatch = (
    account: Address,
    nftIds: NftRealId[],
    amounts: Amount[],
    ev: Event
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
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
    public async aprs(
        prefix: NftToken, index: Index
    ): Promise<APR> {
        const contract = await this.connect();
        return contract
            .aprs(prefix, index)
            .then(([stamp, value, area]: BigNumber[]) => ({
                stamp: stamp.toBigInt(),
                value: value.toBigInt(),
                area: area.toBigInt()
            }));
    }
    public async bonuses(
        prefix: NftToken, index: Index
    ): Promise<APRBonus> {
        const contract = await this.connect();
        return contract
            .bonuses(prefix, index)
            .then(([stamp, value, area]: BigNumber[]) => ({
                stamp: stamp.toBigInt(),
                value: value.toBigInt(),
                area: area.toBigInt()
            }));
    }
    public async claimFor(
        address: Address, ppt_id: NftRealId
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            this.connect()
        );
        return contract.claimFor(
            x40(address), Nft.realId(ppt_id)
        );
    }
    public async claimForBatch(
        address: Address, ppt_ids: NftRealId[]
    ): Promise<Transaction> {
        const contract = await OtfManager.connect(
            this.connect()
        );
        return contract.claimForBatch(
            x40(address), Nft.realIds(ppt_ids)
        );
    }
    public async claimedFor(
        address: Address, ppt_id: NftRealId
    ): Promise<Amount> {
        const contract = await this.connect();
        return contract
            .claimedFor(x40(address), Nft.realId(ppt_id))
            .then((bn: BigNumber) => bn.toBigInt());
    }
    public async claimedForBatch(
        address: Address, ppt_ids: NftRealId[]
    ): Promise<Amount[]> {
        const contract = await this.connect();
        return contract
            .claimedForBatch(x40(address), Nft.realIds(ppt_ids))
            .then((bns: BigNumber[]) => bns.map((bn) => bn.toBigInt()));
    }

    public async claimableFor(
        address: Address, ppt_id: NftRealId
    ): Promise<Amount> {
        const contract = await this.connect();
        return contract
            .claimableFor(x40(address), Nft.realId(ppt_id))
            .then((bn: BigNumber) => bn.toBigInt());
    }
    public async claimableForBatch(
        address: Address, ppt_ids: NftRealId[]
    ): Promise<Amount[]> {
        const contract = await this.connect();
        return contract
            .claimableForBatch(x40(address), Nft.realIds(ppt_ids))
            .then((bns: BigNumber[]) => bns.map((bn) => bn.toBigInt()));
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
        const contract = await this.connect();
        return contract
            .rateOf(Nft.realId(ppt_id))
            .then((bn: BigNumber) => bn.toBigInt());
    }
    public async aprOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        const contract = await this.connect();
        return contract
            .aprOf(Nft.realId(ppt_id))
            .then((bn: BigNumber) => bn.toBigInt());
    }
    public async aprBonusOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        const contract = await this.connect();
        return contract
            .aprBonusOf(Nft.realId(ppt_id))
            .then((bn: BigNumber) => bn.toBigInt());
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
        const contract = await this.connect();
        return contract
            .aprTargetOf(Nft.realId(ppt_id))
            .then((bn: BigNumber) => bn.toBigInt());
    }
    public async aprBonusTargetOf(
        ppt_id: NftRealId
    ): Promise<Rate> {
        const contract = await this.connect();
        return contract
            .aprBonusTargetOf(Nft.realId(ppt_id))
            .then((bn: BigNumber) => bn.toBigInt());
    }
    public async onBlock(
        listener: Listener
    ) {
        const contract = await this.connect();
        contract.provider.on('block', listener);
    }
    public async onClaim(
        listener: OnClaim
    ) {
        const contract = await this.connect();
        return contract.on('Claim', (
            account: string, id: BigNumber, amount: BigNumber, ev: Event
        ) => {
            const address = BigInt(account);
            const nft_id = id.toString() as NftRealId;
            listener(address, nft_id, amount.toBigInt(), ev);
        });
    }
    public async onClaimBatch(
        listener: OnClaimBatch
    ) {
        const contract = await this.connect();
        return contract.on('ClaimBatch', (
            account: string, ids: BigNumber[], amounts: BigNumber[], ev: Event
        ) => {
            const address = BigInt(account);
            const nft_ids = ids.map((id) => id.toString() as NftRealId);
            listener(address, nft_ids, amounts.map((a) => a.toBigInt()), ev);
        });
    }
    public async moeBalanceOf(
        index: Index | Promise<Index>
    ): Promise<Balance> {
        const contract = await this.connect();
        if (ROParams.version < Version.v6b) {
            return contract.balance()
                .then((bn: BigNumber) => bn.toBigInt());
        }
        return contract
            .moeBalanceOf(await index)
            .then((bn: BigNumber) => bn.toBigInt());
    }
    public async moeIndexOf(
        address: Address
    ): Promise<Index> {
        const contract = await this.connect();
        return contract
            .moeIndexOf(x40(address))
            .then((bn: BigNumber) => bn.toNumber());
    }
}
export default MoeTreasury;
