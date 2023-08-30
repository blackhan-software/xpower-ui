import { Store } from '@reduxjs/toolkit';

import { Blockchain } from '../blockchain';
import { APB, APR, MoeTreasury, MoeTreasuryFactory } from '../contract';
import { buffered, range } from '../functions';
import { onRatesUiRefresher } from '../redux/observers';
import { AppState } from '../redux/store';
import { Index, Nft, NftFullId, NftLevel, NftLevels, Rate, RefresherStatus } from '../redux/types';

import * as actions from '../redux/actions';

export const RatesService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(function initRates() {
        const mty = MoeTreasuryFactory();
        fetch(mty).then((rates) => {
            update(store, rates)
        });
    });
    Blockchain.onceConnect(function syncRates() {
        const mty = MoeTreasuryFactory();
        mty.onRefreshRates(buffered(() => {
            fetch(mty).then((rates) => update(store, rates));
        }));
    });
    Blockchain.onceConnect(function syncRates() {
        onRatesUiRefresher(store, ({ status }) => {
            if (status !== RefresherStatus.refetch) {
                return;
            }
            const mty = MoeTreasuryFactory();
            fetch(mty).then(
                (rates) => update(store, rates)
            );
        });
    });
}
function fetch(
    mty: MoeTreasury
) {
    return Promise.all(
        Array.from(NftLevels()).map((l) => Promise.all([
            new APRs(mty).fetch(l),
            new APBs(mty).fetch(l),
        ]))
    );
}
function update(
    store: Store<AppState>, rates: Array<[APR[], APR[]]>
) {
    for (const [l, [aprs, apbs]] of Object.entries(rates)) {
        for (const [i, apr] of Object.entries(aprs)) {
            store.dispatch(actions.setAPR(
                3 * Number(l), Number(i), apr)
            );
        }
        for (const [i, apb] of Object.entries(apbs)) {
            store.dispatch(actions.setAPB(
                3 * Number(l), Number(i), apb)
            );
        }
    }
}
class APRs {
    constructor(
         mty: MoeTreasury
    ) {
        this.mty = mty;
    }
    async fetch(
        level: NftLevel
    ): Promise<APR[]> {
        const ppt_id = Nft.fullId({
            issue: 2021, level
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
    mty: MoeTreasury;
}
class APBs {
    constructor(
        mty: MoeTreasury
    ) {
        this.mty = mty;
    }
    async fetch(
        level: NftLevel
    ): Promise<APR[]> {
        const ppt_id = Nft.fullId({
            issue: 2021, level
        });
        const length = await this.mty.apbsLength(ppt_id);
        if (length !== undefined) {
            return this.list(ppt_id, Array.from(range(length)))
        }
        return this.next(ppt_id);
    }
    async list(
        ppt_id: NftFullId, indices: Index[]
    ): Promise<APB[]> {
        return this.tail(ppt_id, await Promise.all(indices.map((i) =>
            this.mty.apbs(ppt_id, i)
        )));
    }
    async next(
        ppt_id: NftFullId, index: Index = 0, list = [] as APB[]
    ): Promise<APB[]> {
        try {
            list.push(await this.mty.apbs(ppt_id, index));
        } catch (ex) {
            return this.tail(ppt_id, list);
        }
        return this.next(ppt_id, index + 1, list);
    }
    async tail(
        ppt_id: NftFullId, list: APB[]
    ) {
        const target = await this.fake(ppt_id);
        list.push(aprify(target, list));
        return list;
    }
    async fake(
        ppt_id: NftFullId
    ) {
        try {
            return this.mty.apbTargetOf(ppt_id);
        } catch (ex) {
            console.error(ex);
            return 0n;
        }
    }
    mty: MoeTreasury;
}
function aprify(
    value: Rate, list: APR[]
): APR | APB {
    const stamp = BigInt(new Date().getTime()) / 1000n;
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
