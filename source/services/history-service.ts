import { Store } from '@reduxjs/toolkit';
import { BigNumber, Contract } from 'ethers';
import { Blockchain } from '../blockchain';
import { XPowerMoeFactory, XPowerNftFactory, XPowerPptFactory, XPowerSovFactory } from '../contract';
import { x40 } from '../functions';
import { xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Nft, NftLevels, Token } from '../redux/types';
import { Version, Versions } from '../types';
import { Years } from '../years';

import * as actions from '../redux/actions';

export const HistoryService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initBalances({
        token, version
    }) {
        const versions = Array.from(Versions())
            .filter((v) => v < version).reverse();
        const balances = versions.map((version) => ({
            version, balance: get_balances(token, version)
        }));
        for (const { version, balance } of balances) {
            const { moe, sov, nft, ppt } = await balance;
            store.dispatch(actions.setMoeHistory(version, token, moe));
            store.dispatch(actions.setSovHistory(version, token, sov));
            store.dispatch(actions.setNftHistory(version, token, nft));
            store.dispatch(actions.setPptHistory(version, token, ppt));
        }
    }, {
        per: () => xtokenOf(store.getState())
    });
}
async function get_balances(
    token: Token, version: Version
) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels()),
        token: Nft.token(token)
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const {
        moe_contract, sov_contract,
        nft_contract, ppt_contract,
    } = await contracts({
        token, version
    });
    const moe = moe_contract
        ? await moe_contract.balanceOf(x40(address))
        : BigNumber.from(0);
    const sov = sov_contract
        ? await sov_contract.balanceOf(x40(address))
        : BigNumber.from(0);
    const nft = Object.fromEntries(ids.map((id) => [id, { balance: 0n }]));
    if (nft_contract) {
        const balances: BigNumber[] = await nft_contract.balanceOfBatch(
            accounts, Nft.realIds(ids, { version })
        );
        for (let i = 0; i < ids.length; i++) {
            const full_id = Nft.fullIdOf({
                real_id: ids[i], token: Nft.token(token)
            });
            nft[full_id] = {
                balance: balances[i].toBigInt()
            };
        }
    }
    const ppt = Object.fromEntries(ids.map((id) => [id, { balance: 0n }]));
    if (ppt_contract) {
        const balances: BigNumber[] = await ppt_contract.balanceOfBatch(
            accounts, Nft.realIds(ids, { version })
        );
        for (let i = 0; i < ids.length; i++) {
            const full_id = Nft.fullIdOf({
                real_id: ids[i], token: Nft.token(token)
            });
            ppt[full_id] = {
                balance: balances[i].toBigInt()
            };
        }
    }
    return {
        moe: { balance: moe.toBigInt() }, nft,
        sov: { balance: sov.toBigInt() }, ppt,
    };
}
async function contracts({
    token, version
}: {
    token: Token, version: Version
}) {
    let moe_contract: Contract | undefined;
    try {
        moe_contract = await XPowerMoeFactory({
            token, version
        });
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let sov_contract: Contract | undefined;
    try {
        sov_contract = await XPowerSovFactory({
            token, version
        });
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let nft_contract: Contract | undefined;
    try {
        nft_contract = await XPowerNftFactory({
            token, version
        });
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let ppt_contract: Contract | undefined;
    try {
        ppt_contract = await XPowerPptFactory({
            token, version
        });
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    return {
        moe_contract,
        sov_contract,
        nft_contract,
        ppt_contract
    };
}
export default HistoryService;
