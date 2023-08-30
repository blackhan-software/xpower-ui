import { Store } from '@reduxjs/toolkit';

import { Blockchain } from '../blockchain';
import { x40 } from '../functions';
import { AppState } from '../redux/store';
import { Account, Balance, Nft, NftLevels } from '../redux/types';
import { Version, Versions } from '../types';
import { MoeWallet, NftWallet, PptWallet, SovWallet } from '../wallet';
import { Years } from '../years';

import * as actions from '../redux/actions';

export const HistoryService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initBalances({
        version
    }) {
        const versions = Array.from(Versions())
            .filter((v) => v < version).reverse();
        const balances = versions.map((version) => ({
            version, balance: get_balances(version)
        }));
        for (const { version, balance } of balances) {
            const { moe, sov, nft, ppt } = await balance;
            store.dispatch(actions.setMoeHistory(version, moe));
            store.dispatch(actions.setSovHistory(version, sov));
            store.dispatch(actions.setNftHistory(version, nft));
            store.dispatch(actions.setPptHistory(version, ppt));
        }
    });
}
async function get_balances(
    version: Version
) {
    const account = await Blockchain.account;
    if (!account) {
        throw new Error('missing account');
    }
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(account);
    });
    const {
        moe_contract, sov_contract,
        nft_contract, ppt_contract,
    } = await contracts({
        account, version
    });
    const moe = moe_contract
        ? await moe_contract.balance : 0n;
    const sov = sov_contract
        ? await sov_contract.balance : 0n;
    const nft = Object.fromEntries(ids.map((id) => [id, { balance: 0n }]));
    if (nft_contract) {
        const balances: Balance[] = await nft_contract.get.then(
            (c) => c.balanceOfBatch(accounts, Nft.realIds(ids, { version }))
        );
        for (let i = 0; i < ids.length; i++) {
            const full_id = Nft.fullIdOf({
                real_id: ids[i]
            });
            nft[full_id] = { balance: balances[i] };
        }
    }
    const ppt = Object.fromEntries(ids.map((id) => [id, { balance: 0n }]));
    if (ppt_contract) {
        const balances: Balance[] = await ppt_contract.get.then(
            (c) => c.balanceOfBatch(accounts, Nft.realIds(ids, { version }))
        );
        for (let i = 0; i < ids.length; i++) {
            const full_id = Nft.fullIdOf({
                real_id: ids[i]
            });
            ppt[full_id] = { balance: balances[i] };
        }
    }
    return {
        moe: { balance: moe }, nft,
        sov: { balance: sov }, ppt,
    };
}
async function contracts({
    account, version
}: {
    account: Account, version: Version
}) {
    let moe_contract: MoeWallet | undefined;
    try {
        moe_contract = new MoeWallet(
            account, version
        );
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let sov_contract: SovWallet | undefined;
    try {
        sov_contract = new SovWallet(
            account, version
        );
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let nft_contract: NftWallet | undefined;
    try {
        nft_contract = new NftWallet(
            account, version
        );
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let ppt_contract: PptWallet | undefined;
    try {
        ppt_contract = new PptWallet(
            account, version
        );
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
