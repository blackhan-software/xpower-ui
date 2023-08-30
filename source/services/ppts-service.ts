import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { MoeTreasuryFactory } from '../contract';
import { buffered, x40 } from '../functions';
import { globalRef } from '../react';
import { addPpt, removePpt, setPpt } from '../redux/actions';
import { pptsBy } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Nft, NftFullId, NftLevels } from '../redux/types';
import { OnTransferBatch, OnTransferSingle, PptWallet } from '../wallet';
import { Years } from '../years';

export const PptsService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initPpts({
        account
    }) {
        let index = 0;
        const levels = Array.from(NftLevels());
        const issues = Array.from(Years({ reverse: true }));
        const wallet = new PptWallet(account);
        const balances = await wallet.balances({
            issues, levels
        });
        const supplies = await wallet.totalSupplies({
            issues, levels
        });
        for (const issue of issues) {
            for (const level of levels) {
                const amount = balances[index];
                const supply = supplies[index];
                store.dispatch(setPpt({
                    issue, level
                }, {
                    amount, supply
                }));
                index += 1;
            }
        }
    });
    Blockchain.onConnect(function syncPpts() {
        const ppts = pptsBy(store.getState());
        for (const [id, ppt] of Object.entries(ppts.items)) {
            store.dispatch(setPpt(id as NftFullId, ppt));
        }
    });
    Blockchain.onceConnect(async function onPptSingleTransfers({
        account
    }) {
        const on_transfer: OnTransferSingle = async (
            op, from, to, id, value, ev
        ) => {
            console.debug('[on:transfer-single]',
                x40(op), x40(from), x40(to),
                id, value, ev
            );
            const nft_id = Nft.fullId({
                issue: Nft.issue(id),
                level: Nft.level(id)
            });
            if (account === from) {
                store.dispatch(removePpt(nft_id, {
                    kind: to ? 'transfer' : 'burn',
                    amount: value
                }));
            }
            if (account === to) {
                store.dispatch(addPpt(nft_id, {
                    amount: value
                }));
            }
        };
        const ppt_wallet = new PptWallet(account);
        ppt_wallet.onTransferSingle(on_transfer)
    });
    Blockchain.onceConnect(async function onPptBatchTransfers({
        account
    }) {
        const on_transfer: OnTransferBatch = async (
            op, from, to, ids, values, ev
        ) => {
            console.debug('[on:transfer-batch]',
                x40(op), x40(from), x40(to),
                ids, values, ev
            );
            for (let i = 0; i < ids.length; i++) {
                const ppt_id = Nft.fullId({
                    issue: Nft.issue(ids[i]),
                    level: Nft.level(ids[i])
                });
                if (account === from) {
                    store.dispatch(removePpt(ppt_id, {
                        kind: to ? 'transfer' : 'burn',
                        amount: values[i]
                    }));
                }
                if (account === to) {
                    store.dispatch(addPpt(ppt_id, {
                        amount: values[i]
                    }));
                }
            }
        };
        const ppt_wallet = new PptWallet(account);
        ppt_wallet.onTransferBatch(on_transfer);
    });
    Blockchain.onceConnect(async function updateClaims() {
        const moe_treasury = MoeTreasuryFactory();
        moe_treasury.onBlock(buffered(() => {
            const { details } = store.getState().ppts_ui;
            Object.entries(details).forEach(([
                nft_level, nft_issues
            ]) => {
                Object.entries(nft_issues).forEach(([
                    nft_issue, { fixed, toggled }
                ]) => {
                    if (fixed || toggled) {
                        const full_id = Nft.fullId({
                            level: Number(nft_level),
                            issue: Number(nft_issue)
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
