/* eslint @typescript-eslint/no-require-imports: [off] */
import { AbiCoder, getBytes, id, InterfaceAbi, Listener, MaxUint256, TransactionResponse } from 'ethers';
import { IHasher, KeccakHasher } from 'wasm-miner';

import { MYProvider } from '../../blockchain';
import { LocalStorage, memoized, x40 } from '../../functions';
import { ROParams } from '../../params';
import { Account, Address, Amount, Index, Nft, NftFullId, NftRealId, Rate } from '../../redux/types';
import { TxEvent, Version, VersionAt } from '../../types';
import { OtfManager } from '../../wallet';
import { Base } from '../base';

import { XpbPool } from '../xpb-pool/xpb-pool';
import { XpbPoolFactory } from '../xpb-pool/xpb-pool-factory';
import { XPowerSovFactory } from '../xpower-sov/xpower-sov-factory';

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
    constructor(
        address: Address, version = ROParams.version,
        abi: InterfaceAbi = ABI
    ) {
        if (ROParams.lt2(version, VersionAt(-1))) {
            abi = require(`./moe-treasury.abi.${version}.json`);
        }
        super(address, abi);
        this.version = version;
    }
    aprs = memoized(async (
        ppt_id: NftFullId, index: Index
    ): Promise<APR> => {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        return contract.aprs(id, index).then(
            ([stamp, value, area]: bigint[]) => ({
                stamp, value, area
            })
        );
    }, (
        ppt_id: NftFullId, index: Index
    ) => {
        return `apr:${ppt_id}:${index}:${this.version}`;
    }, () => {
        return new LocalStorage<string, Promise<APR>>();
    });
    async aprsLength(
        ppt_id: NftFullId
    ): Promise<number | undefined> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v07b)) {
            return undefined;
        }
        return contract.aprsLength(id);
    }
    apbs = memoized(async (
        ppt_id: NftFullId, index: Index
    ): Promise<APB> => {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.bonuses(id, index).then(
                ([stamp, value, area]: bigint[]) => ({
                    stamp, value, area
                })
            );
        }
        return contract.apbs(id, index).then(
            ([stamp, value, area]: bigint[]) => ({
                stamp, value, area
            })
        );
    }, (
        ppt_id: NftFullId, index: Index
    ) => {
        return `apb:${ppt_id}:${index}:${this.version}`;
    }, () => {
        return new LocalStorage<string, Promise<APR>>();
    });
    async apbsLength(
        ppt_id: NftFullId
    ): Promise<number | undefined> {
        if (ROParams.lt2(this.version, Version.v07b)) {
            return undefined;
        }
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.bonusesLength(id);
        }
        return contract.apbsLength(id);
    }
    async claim(
        address: Account, ppt_id: NftFullId
    ): Promise<TransactionResponse> {
        const contract = await this.otf;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.claimFor(x40(address), id);
        }
        if (ROParams.lt2(this.version, Version.v10a)) {
            return contract.claim(x40(address), id);
        }
        // Check if proof-of-work nonce is required:
        {
            const sov_token = XPowerSovFactory({
                version: this.version
            });
            const [pool, amount] = await Promise.all([
                this.pool(), this.mintable(address, ppt_id),
            ]);
            const [difficulty, blockHash] = await Promise.all([
                pool?.supplyDifficultyOf(sov_token.address, amount),
                pool?.blockHash(),
            ]);
            if (difficulty && blockHash) {
                const data = supplyData(
                    x40(address), sov_token.address, amount
                );
                const nonce = await pow(data, difficulty, {
                    address: x40(address), blockHash,
                });
                return contract.claim(
                    x40(address), id, amount, nonce
                );
            }
        }
        return contract.claim(
            x40(address), id, MaxUint256, 0
        );
    }
    async claimBatch(
        address: Account, ppt_ids: NftFullId[]
    ): Promise<TransactionResponse> {
        const contract = await this.otf;
        const ids = Nft.realIds(ppt_ids, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.claimForBatch(x40(address), ids);
        }
        if (ROParams.lt2(this.version, Version.v10a)) {
            return contract.claimBatch(x40(address), ids);
        }
        // Check if proof-of-work nonce is required:
        {
            const sov_token = XPowerSovFactory({
                version: this.version
            });
            const [pool, amount] = await Promise.all([
                this.pool(), this.mintableBatch(address, ppt_ids).then(
                    (a) => a.reduce((s, n) => s + n, 0n)
                ),
            ]);
            const [difficulty, blockHash] = await Promise.all([
                pool?.supplyDifficultyOf(sov_token.address, amount),
                pool?.blockHash(),
            ]);
            if (difficulty && blockHash) {
                const data = supplyData(
                    x40(address), sov_token.address, amount
                );
                const nonce = await pow(data, difficulty, {
                    address: x40(address), blockHash,
                });
                return contract.claimBatch(
                    x40(address), ids, amount, nonce
                );
            }
        }
        return contract.claimBatch(
            x40(address), ids, MaxUint256, 0
        );
    }
    async pool(): Promise<XpbPool | undefined> {
        const contract = await this.get;
        if (ROParams.lt(Version.v10a)) {
            return XpbPoolFactory({ address: x40(1) });
        }
        const address = await contract.pool();
        if (BigInt(address ?? '0x0')) {
            return XpbPoolFactory({ address });
        }
        return undefined;
    }
    async claimed(
        address: Account, ppt_id: NftFullId
    ): Promise<Amount> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.claimedFor(x40(address), id);
        }
        return contract.claimed(x40(address), id);
    }
    async claimedBatch(
        address: Account, ppt_ids: NftFullId[]
    ): Promise<Amount[]> {
        const contract = await this.get;
        const ids = Nft.realIds(ppt_ids, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.claimedForBatch(x40(address), ids);
        }
        return contract.claimedBatch(x40(address), ids);
    }
    async claimable(
        address: Account, ppt_id: NftFullId
    ): Promise<Amount> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.claimableFor(x40(address), id);
        }
        return contract.claimable(x40(address), id);
    }
    async claimableBatch(
        address: Account, ppt_ids: NftFullId[]
    ): Promise<Amount[]> {
        const contract = await this.get;
        const ids = Nft.realIds(ppt_ids, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.claimableForBatch(x40(address), ids);
        }
        return contract.claimableBatch(x40(address), ids);
    }
    async minted(
        address: Account, ppt_id: NftFullId
    ): Promise<Amount> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08b)) {
            return this.claimed(address, ppt_id)
        }
        return contract.minted(x40(address), id);
    }
    async mintedBatch(
        address: Account, ppt_ids: NftFullId[]
    ): Promise<Amount[]> {
        const contract = await this.get;
        const ids = Nft.realIds(ppt_ids, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08b)) {
            return this.claimedBatch(address, ppt_ids);
        }
        return contract.mintedBatch(x40(address), ids);
    }
    async mintable(
        address: Account, ppt_id: NftFullId
    ): Promise<Amount> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08b)) {
            return this.claimable(address, ppt_id);
        }
        return contract.mintable(x40(address), id);
    }
    async mintableBatch(
        address: Account, ppt_ids: NftFullId[]
    ): Promise<Amount[]> {
        const contract = await this.get;
        const ids = Nft.realIds(ppt_ids, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08b)) {
            return this.claimableBatch(address, ppt_ids);
        }
        return contract.mintableBatch(x40(address), ids);
    }
    async aprOf(
        ppt_id: NftFullId
    ): Promise<Rate> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        return contract.aprOf(id);
    }
    async apbOf(
        ppt_id: NftFullId
    ): Promise<Rate> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.aprBonusOf(id);
        }
        return contract.apbOf(id);
    }
    async aprTargetOf(
        ppt_id: NftFullId
    ): Promise<Rate> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v06b)) {
            return 0n;
        }
        return contract.aprTargetOf(id);
    }
    async apbTargetOf(
        ppt_id: NftFullId
    ): Promise<Rate> {
        const contract = await this.get;
        const id = Nft.realId(ppt_id, {
            version: this.version
        });
        if (ROParams.lt2(this.version, Version.v06b)) {
            return 0n;
        }
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.aprBonusTargetOf(id);
        }
        return contract.apbTargetOf(id);
    }
    async onBlock(
        listener: Listener
    ): Promise<void> {
        const provider = await MYProvider();
        provider?.on('block', listener);
    }
    async onClaim(
        listener: OnClaim, { once } = { once: false }
    ): Promise<void> {
        const on_claim = (
            account: string, id: bigint, amount: Amount, ev: TxEvent
        ) => {
            const nft_id = Nft.fullIdOf({
                real_id: id.toString() as NftRealId
            });
            listener(BigInt(account), nft_id, amount, ev);
        };
        if (once) {
            await this.get.then((c) => c.once('Claim', on_claim));
        } else {
            await this.get.then((c) => c.on('Claim', on_claim));
        }
    }
    async offClaim(
        listener: OnClaim
    ): Promise<void> {
        await this.get.then((c) => c.off('Claim', listener));
    }
    async onClaimBatch(
        listener: OnClaimBatch, { once } = { once: false }
    ): Promise<void> {
        const on_claim_batch = (
            account: string, ids: bigint[], amounts: Amount[], ev: TxEvent
        ) => {
            const nft_ids = Nft.fullIdsOf({
                real_ids: ids.map((id) => id.toString() as NftRealId)
            });
            listener(BigInt(account), nft_ids, amounts, ev);
        };
        if (once) {
            await this.get.then((c) => c.once('ClaimBatch', on_claim_batch));
        } else {
            await this.get.then((c) => c.on('ClaimBatch', on_claim_batch));
        }
    }
    async offClaimBatch(
        listener: OnClaimBatch
    ): Promise<void> {
        await this.get.then((c) => c.off('ClaimBatch', listener));
    }
    async refreshRates(
        all_levels: boolean
    ): Promise<TransactionResponse> {
        const contract = await this.otf;
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.refreshRates(2, all_levels);
        }
        return contract.refreshRates(all_levels);
    }
    async refreshable(): Promise<boolean> {
        const contract = await this.get;
        if (ROParams.lt2(this.version, Version.v08a)) {
            return contract.refreshable(2);
        }
        return contract.refreshable();
    }
    async onRefreshRates(
        listener: OnRefresh, { once } = { once: false }
    ): Promise<void> {
        if (ROParams.lt2(this.version, Version.v07c)) {
            return;
        }
        if (once) {
            await this.get.then((c) => c.once('RefreshRates', listener));
        } else {
            await this.get.then((c) => c.on('RefreshRates', listener));
        }
    }
    async offRefreshRates(
        listener: OnRefresh
    ): Promise<void> {
        await this.get.then((c) => c.off('RefreshRates', listener));
    }
    private get otf() {
        return OtfManager.connect(this.connect());
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
    private version: Version;
}
/**
 * @returns data suffixed with proof-of-work nonce=0
 */
function supplyData(
    account: Address, token: Address, amount: bigint
): string {
    const selector = id("supply(address,address,uint256,bool)");
    const args = AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256", "bool", "uint256"],
        [account, token, amount, true, 0n],
    );
    return selector.slice(0, 10) + args.slice(2);
}
/**
 * @returns proof-of-work nonce (if available)
 */
async function pow(
    data: string, difficulty: bigint,
    ctx: { address: Address, blockHash: string },
): Promise<bigint> {
    const bytes = getBytes(
        ctx.blockHash + `${ctx.address}`.slice(2) + data.slice(2),
    );
    const hasher = await KeccakHasher();
    const zeros = Number(difficulty);
    const step = BigInt(4 ** zeros);
    for (let i = 0n; true; i++) {
        const range: [bigint, bigint] = [step * i, step * (i + 1n)];
        const nonce = await pow_wasm(hasher, bytes, range, zeros);
        if (nonce >= 0n) return nonce;
    }
}
/**
 * @returns proof-of-work nonce (if available)
 */
function pow_wasm(
    hasher: IHasher,
    bytes: Uint8Array,
    range: [bigint, bigint],
    zeros: number,
): Promise<bigint> {
    return new Promise((resolve) => {
        hasher.reduce(bytes, {
            callback: resolve, range, zeros
        });
        resolve(-1n);
    });
}
export default MoeTreasury;
