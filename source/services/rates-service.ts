import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { APR, APRBonus, MoeTreasuryFactory } from '../contract';
import { xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Index, Nft, NftFullId, Rate, Token } from '../redux/types';

import * as actions from '../redux/actions';

export const RatesService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initRates({
        token
    }) {
        const aprs = await fetch_aprs(token);
        for (const [i, apr] of Object.entries(aprs)) {
            store.dispatch(actions.setAPR(token, Number(i), apr));
        }
        const bonuses = await fetch_bonuses(token);
        for (const [i, bonus] of Object.entries(bonuses)) {
            store.dispatch(actions.setAPRBonus(token, Number(i), bonus));
        }
    }, {
        per: () => xtokenOf(store.getState())
    });
}
async function fetch_aprs(
    token: Token, index: Index = 0, list = [] as APR[]
): Promise<APR[]> {
    const mty = MoeTreasuryFactory({ token });
    try {
        list.push(await mty.aprs(Nft.token(token), index));
    } catch (ex) {
        const target = await aprTargetOf(token, Nft.fullId({
            issue: 2021, level: 3, token: Nft.token(token)
        }));
        list.push(aprify(target, list));
        return list;
    }
    return await fetch_aprs(token, index + 1, list);
}
async function aprTargetOf(
    token: Token, nft_id: NftFullId
) {
    const mty = MoeTreasuryFactory({ token });
    try {
        return await mty.aprTargetOf(nft_id);
    } catch (ex) {
        console.error(ex);
        return 0n;
    }
}
async function fetch_bonuses(
    token: Token, index: Index = 0, list = [] as APR[]
): Promise<APRBonus[]> {
    const mty = MoeTreasuryFactory({ token });
    try {
        list.push(await mty.bonuses(Nft.token(token), index));
    } catch (ex) {
        const target = await aprBonusTargetOf(token, Nft.fullId({
            issue: 2021, level: 3, token: Nft.token(token)
        }));
        list.push(aprify(target, list));
        return list;
    }
    return await fetch_bonuses(token, index + 1, list);
}
async function aprBonusTargetOf(
    token: Token, nft_id: NftFullId
) {
    const mty = MoeTreasuryFactory({ token });
    try {
        return await mty.aprBonusTargetOf(nft_id);
    } catch (ex) {
        console.error(ex);
        return 0n;
    }
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
