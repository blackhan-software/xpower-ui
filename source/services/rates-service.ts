import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { APR, APRBonus, MoeTreasuryFactory } from '../contract';
import { range } from '../functions';
import { xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Index, Nft, NftFullId, NftLevel, NftLevels, NftToken, Rate, Token } from '../redux/types';

import * as actions from '../redux/actions';

export const RatesService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initRates({
        token
    }) {
        const rates = await Promise.all(
            Array.from(NftLevels()).map((l) => Promise.all([
                new APRs(token).fetch(l),
                new APBs(token).fetch(l),
            ]))
        );
        for (const [l, [aprs, apbs]] of Object.entries(rates)) {
            for (const [i, apr] of Object.entries(aprs)) {
                store.dispatch(actions.setAPR(
                    token, 3 * Number(l), Number(i), apr)
                );
            }
            for (const [i, apb] of Object.entries(apbs)) {
                store.dispatch(actions.setAPRBonus(
                    token, 3 * Number(l), Number(i), apb)
                );
            }
        }
    }, {
        per: () => xtokenOf(store.getState())
    });
}
class APRs {
    constructor(token: Token) {
        this.mty = MoeTreasuryFactory({ token });
        this.nftToken = Nft.token(token);
        this.token = token;
    }
    async fetch(
        level: NftLevel
    ): Promise<APR[]> {
        const ppt_id = Nft.fullId({
            issue: 2021, level, token: this.nftToken
        });
        const length = await this.mty.aprsLength(ppt_id);
        if (length !== undefined) {
            return this.list(ppt_id, Array.from(range(length)))
        }
        return this.next(ppt_id);
    }
    async list(
        ppt_id: NftFullId, indices: Index[]
    ): Promise<APR[]> {
        return this.tail(ppt_id, await Promise.all(indices.map((i) =>
            this.mty.aprs(ppt_id, i)
        )));
    }
    async next(
        ppt_id: NftFullId, index: Index = 0, list = [] as APR[]
    ): Promise<APR[]> {
        try {
            list.push(await this.mty.aprs(ppt_id, index));
        } catch (ex) {
            return this.tail(ppt_id, list);
        }
        return this.next(ppt_id, index + 1, list);
    }
    async tail(
        ppt_id: NftFullId, list: APR[]
    ) {
        const target = await this.fake(ppt_id);
        list.push(aprify(target, list));
        return list;
    }
    async fake(
        ppt_id: NftFullId
    ) {
        try {
            return this.mty.aprTargetOf(ppt_id);
        } catch (ex) {
            console.error(ex);
            return 0n;
        }
    }
    mty: ReturnType<typeof MoeTreasuryFactory>;
    nftToken: NftToken;
    token: Token;
}
class APBs {
    constructor(token: Token) {
        this.mty = MoeTreasuryFactory({ token });
        this.nftToken = Nft.token(token);
        this.token = token;
    }
    async fetch(
        level: NftLevel
    ): Promise<APR[]> {
        const ppt_id = Nft.fullId({
            issue: 2021, level, token: this.nftToken
        });
        const length = await this.mty.bonusesLength(ppt_id);
        if (length !== undefined) {
            return this.list(ppt_id, Array.from(range(length)))
        }
        return this.next(ppt_id);
    }
    async list(
        ppt_id: NftFullId, indices: Index[]
    ): Promise<APRBonus[]> {
        return this.tail(ppt_id, await Promise.all(indices.map((i) =>
            this.mty.bonuses(ppt_id, i)
        )));
    }
    async next(
        ppt_id: NftFullId, index: Index = 0, list = [] as APRBonus[]
    ): Promise<APRBonus[]> {
        try {
            list.push(await this.mty.bonuses(this.nftToken, index));
        } catch (ex) {
            return this.tail(ppt_id, list);
        }
        return this.next(ppt_id, index + 1, list);
    }
    async tail(
        ppt_id: NftFullId, list: APRBonus[]
    ) {
        const target = await this.fake(ppt_id);
        list.push(aprify(target, list));
        return list;
    }
    async fake(
        ppt_id: NftFullId
    ) {
        try {
            return this.mty.aprBonusTargetOf(ppt_id);
        } catch (ex) {
            console.error(ex);
            return 0n;
        }
    }
    mty: ReturnType<typeof MoeTreasuryFactory>;
    nftToken: NftToken;
    token: Token;
}
function aprify(
    value: Rate, list: APR[]
): APR | APRBonus {
    const now = new Date().getTime() / 1000;
    const stamp = BigInt(Math.round(now));
    if (list.length > 0) {
        const last = list[list.length - 1];
        const area = value * (stamp - last.stamp);
        return {
            stamp, value, area: last.area + area
        };
    }
    return {
        stamp, value, area: 0n
    };
}
export default RatesService;
