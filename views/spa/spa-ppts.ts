import { Blockchain } from '../../source/blockchain';
import { MoeTreasuryFactory } from '../../source/contract';
import { buffered, globalRef, x40 } from '../../source/functions';
import { addPpt, removePpt, setPpt } from '../../source/redux/actions';
import { pptsBy, tokenOf } from '../../source/redux/selectors';
import { Store } from '../../source/redux/store';
import { Nft, NftFullId, NftLevels } from '../../source/redux/types';
import { OnTransferBatch, OnTransferSingle, PptWallet } from '../../source/wallet';
import { Years } from '../../source/years';
/**
 * ppts:
 */
Blockchain.onceConnect(async function initPpts({
    address, token
}) {
    let index = 0;
    const levels = Array.from(NftLevels());
    const issues = Array.from(Years({ reverse: true }));
    const wallet = new PptWallet(address, token);
    const balances = await wallet.balances({ issues, levels });
    const supplies = wallet.totalSupplies({ issues, levels });
    const ppt_token = Nft.token(
        token
    );
    for (const issue of issues) {
        for (const level of levels) {
            const amount = balances[index];
            const supply = await supplies[index];
            Store.dispatch(setPpt({
                issue, level, token: ppt_token
            }, {
                amount, supply
            }));
            index += 1;
        }
    }
}, {
    per: () => tokenOf(Store.state)
});
Blockchain.onConnect(function syncPpts({
    token
}) {
    const ppts = pptsBy(Store.state, {
        token: Nft.token(token)
    });
    for (const [id, ppt] of Object.entries(ppts.items)) {
        Store.dispatch(setPpt(id as NftFullId, ppt));
    }
});
Blockchain.onceConnect(async function onPptSingleTransfers({
    address, token
}) {
    const on_transfer: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (tokenOf(Store.state) !== token) {
            return;
        }
        console.debug('[on:transfer-single]',
            x40(op), x40(from), x40(to),
            id, value, ev
        );
        const nft_token = Nft.token(
            token
        );
        const nft_id = Nft.fullId({
            issue: Nft.issue(id),
            level: Nft.level(id),
            token: nft_token
        });
        if (address === from) {
            Store.dispatch(removePpt(nft_id, {
                kind: to ? 'transfer' : 'burn',
                amount: value
            }));
        }
        if (address === to) {
            Store.dispatch(addPpt(nft_id, {
                amount: value
            }));
        }
    };
    const ppt_wallet = new PptWallet(address, token);
    ppt_wallet.onTransferSingle(on_transfer)
}, {
    per: () => tokenOf(Store.state)
});
Blockchain.onceConnect(async function onPptBatchTransfers({
    address, token
}) {
    const on_transfer: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (tokenOf(Store.state) !== token) {
            return;
        }
        console.debug('[on:transfer-batch]',
            x40(op), x40(from), x40(to),
            ids, values, ev
        );
        const nft_token = Nft.token(
            token
        );
        for (let i = 0; i < ids.length; i++) {
            const ppt_id = Nft.fullId({
                issue: Nft.issue(ids[i]),
                level: Nft.level(ids[i]),
                token: nft_token
            });
            if (address === from) {
                Store.dispatch(removePpt(ppt_id, {
                    kind: to ? 'transfer' : 'burn',
                    amount: values[i]
                }));
            }
            if (address === to) {
                Store.dispatch(addPpt(ppt_id, {
                    amount: values[i]
                }));
            }
        }
    };
    const ppt_wallet = new PptWallet(address, token);
    ppt_wallet.onTransferBatch(on_transfer);
}, {
    per: () => tokenOf(Store.state)
});
Blockchain.onceConnect(async function updateClaims() {
    const moe_treasury = await MoeTreasuryFactory({
        token: tokenOf(Store.state)
    });
    moe_treasury.provider.on('block', buffered(() => {
        const nft_token = Nft.token(tokenOf(Store.state));
        const { details } = Store.state.ppts_ui;
        const by_token = details[nft_token];
        Object.entries(by_token).forEach(([
            nft_level, nft_issues
        ]) => {
            Object.entries(nft_issues).forEach(([
                nft_issue, { fixed, toggled }
            ]) => {
                if (fixed || toggled) {
                    const core_id = Nft.coreId({
                        level: Number(nft_level),
                        issue: Number(nft_issue)
                    });
                    const $ref = globalRef<HTMLElement>(
                        `:ppt.row[core-id="${core_id}"]`
                    );
                    $ref.current?.dispatchEvent(
                        new Event('refresh-claims')
                    );
                }
            });
        });
    }));
});
