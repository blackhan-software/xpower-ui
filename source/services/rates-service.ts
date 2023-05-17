import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { APR, APRBonus, MoeTreasuryFactory } from '../contract';
import { range } from '../functions';
import { xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Index, Nft, NftFullId, NftToken, Rate, Token } from '../redux/types';

import * as actions from '../redux/actions';

export const RatesService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initRates({
        token
    }) {
        const aprs = await new APRs(token).fetch();
        for (const [i, apr] of Object.entries(aprs)) {
            store.dispatch(actions.setAPR(token, Number(i), apr));
        }
        const apbs = await new APBs(token).fetch();
        for (const [i, apb] of Object.entries(apbs)) {
            store.dispatch(actions.setAPRBonus(token, Number(i), apb));
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
    async fetch(): Promise<APR[]> {
        const length = await this.mty.aprsLength(this.nftToken);
        if (length !== undefined) {
            return this.list(Array.from(range(length)))
        }
        return this.next();
    }
    async list(
        indices: Index[]
    ): Promise<APR[]> {
        return this.tail(await Promise.all(indices.map((i) =>
            this.mty.aprs(this.nftToken, i)
        )));
    }
    async next(
        index: Index = 0, list = [] as APR[]
    ): Promise<APR[]> {
        try {
            list.push(await this.mty.aprs(this.nftToken, index));
        } catch (ex) {
            return this.tail(list);
        }
        return this.next(index + 1, list);
    }
    async tail(
        list: APR[]
    ) {
        const target = await this.fake(Nft.fullId({
            issue: 2021, level: 3, token: this.nftToken
        }));
        list.push(aprify(target, list));
        return list;
    }
    async fake(
        nft_id: NftFullId
    ) {
        try {
            return this.mty.aprTargetOf(nft_id);
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
    async fetch(): Promise<APRBonus[]> {
        const length = await this.mty.bonusesLength(this.nftToken);
        if (length !== undefined) {
            return this.list(Array.from(range(length)))
        }
        return this.next();
    }
    async list(
        indices: Index[]
    ): Promise<APRBonus[]> {
        return this.tail(await Promise.all(indices.map((i) =>
            this.mty.bonuses(this.nftToken, i)
        )));
    }
    async next(
        index: Index = 0, list = [] as APRBonus[]
    ): Promise<APRBonus[]> {
        try {
            list.push(await this.mty.bonuses(this.nftToken, index));
        } catch (ex) {
            return this.tail(list);
        }
        return this.next(index + 1, list);
    }
    async tail(
        list: APRBonus[]
    ) {
        const target = await this.fake(Nft.fullId({
            issue: 2021, level: 3, token: this.nftToken
        }));
        list.push(aprify(target, list));
        return list;
    }
    async fake(
        nft_id: NftFullId
    ) {
        try {
            return this.mty.aprBonusTargetOf(nft_id);
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
