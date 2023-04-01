import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { MoeTreasuryFactory } from '../contract';
import { buffered, x40 } from '../functions';
import { globalRef } from '../react';
import { addPpt, removePpt, setPpt } from '../redux/actions';
import { pptsBy, xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Nft, NftFullId, NftLevels } from '../redux/types';
import { OnTransferBatch, OnTransferSingle, PptWallet } from '../wallet';
import { Years } from '../years';

export const PptsService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initPpts({
        address, token
    }) {
        let index = 0;
        const ppt_token = Nft.token(token);
        const levels = Array.from(NftLevels());
        const issues = Array.from(Years({ reverse: true }));
        const wallet = new PptWallet(address, token);
        const balances = await wallet.balances({
            issues, levels, token: ppt_token
        });
        const supplies = wallet.totalSupplies({
            issues, levels, token: ppt_token
        });
        for (const issue of issues) {
            for (const level of levels) {
                const amount = balances[index];
                const supply = await supplies[index];
                store.dispatch(setPpt({
                    issue, level, token: ppt_token
                }, {
                    amount, supply
                }));
                index += 1;
            }
        }
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onConnect(function syncPpts({
        token
    }) {
        const ppts = pptsBy(store.getState(), {
            token: Nft.token(token)
        });
        for (const [id, ppt] of Object.entries(ppts.items)) {
            store.dispatch(setPpt(id as NftFullId, ppt));
        }
    });
    Blockchain.onceConnect(async function onPptSingleTransfers({
        address, token
    }) {
        const on_transfer: OnTransferSingle = async (
            op, from, to, id, value, ev
        ) => {
            if (xtokenOf(store.getState()) !== token) {
                return;
            }
            console.debug('[on:transfer-single]',
                x40(op), x40(from), x40(to),
                id, value, ev
            );
            const nft_id = Nft.fullId({
                issue: Nft.issue(id),
                level: Nft.level(id),
                token: Nft.token(id)
            });
            if (address === from) {
                store.dispatch(removePpt(nft_id, {
                    kind: to ? 'transfer' : 'burn',
                    amount: value
                }));
            }
            if (address === to) {
                store.dispatch(addPpt(nft_id, {
                    amount: value
                }));
            }
        };
        const ppt_wallet = new PptWallet(address, token);
        ppt_wallet.onTransferSingle(on_transfer)
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(async function onPptBatchTransfers({
        address, token
    }) {
        const on_transfer: OnTransferBatch = async (
            op, from, to, ids, values, ev
        ) => {
            if (xtokenOf(store.getState()) !== token) {
                return;
            }
            console.debug('[on:transfer-batch]',
                x40(op), x40(from), x40(to),
                ids, values, ev
            );
            for (let i = 0; i < ids.length; i++) {
                const ppt_id = Nft.fullId({
                    issue: Nft.issue(ids[i]),
                    level: Nft.level(ids[i]),
                    token: Nft.token(ids[i])
                });
                if (address === from) {
                    store.dispatch(removePpt(ppt_id, {
                        kind: to ? 'transfer' : 'burn',
                        amount: values[i]
                    }));
                }
                if (address === to) {
                    store.dispatch(addPpt(ppt_id, {
                        amount: values[i]
                    }));
                }
            }
        };
        const ppt_wallet = new PptWallet(address, token);
        ppt_wallet.onTransferBatch(on_transfer);
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(async function updateClaims() {
        const moe_treasury = MoeTreasuryFactory({
            token: xtokenOf(store.getState())
        });
        moe_treasury.onBlock(buffered(() => {
            const nft_token = Nft.token(xtokenOf(store.getState()));
            const { details } = store.getState().ppts_ui;
            const by_token = details[nft_token];
            Object.entries(by_token).forEach(([
                nft_level, nft_issues
            ]) => {
                Object.entries(nft_issues).forEach(([
                    nft_issue, { fixed, toggled }
                ]) => {
                    if (fixed || toggled) {
                        const full_id = Nft.fullId({
                            level: Number(nft_level),
                            issue: Number(nft_issue),
                            token: nft_token
                        });
                        const $ref = globalRef<HTMLElement>(
                            `:ppt.row[full-id="${full_id}"]`
                        );
                        $ref.current?.dispatchEvent(
                            new Event('refresh-claims')
                        );
                    }
                });
            });
        }));
    });
}
export default PptsService;
