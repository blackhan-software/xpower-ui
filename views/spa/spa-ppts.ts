import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { MoeTreasuryFactory } from '../../source/contract';
import { ancestor, next } from '../../source/functions';
import { buffered, x40 } from '../../source/functions';
import { Nft, NftFullId, NftLevels } from '../../source/redux/types';
import { PptWallet } from '../../source/wallet';
import { OnTransferBatch } from '../../source/wallet';
import { OnTransferSingle } from '../../source/wallet';
import { Years}  from '../../source/years';

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
            App.setPpt({
                issue, level, token: ppt_token
            }, {
                amount, supply
            });
            index += 1;
        }
    }
}, {
    per: () => App.token
});
Blockchain.onConnect(function syncPpts({
    token
}) {
    const ppts = App.getPpts({
        token: Nft.token(token)
    });
    for (const [id, ppt] of Object.entries(ppts.items)) {
        App.setPpt(id as NftFullId, ppt);
    }
});
Blockchain.onceConnect(async function onPptSingleTransfers({
    address, token
}) {
    const on_transfer: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (App.token !== token) {
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
            App.removePpt(nft_id, { amount: value });
        }
        if (address === to) {
            App.addPpt(nft_id, { amount: value });
        }
    };
    const ppt_wallet = new PptWallet(address, token);
    ppt_wallet.onTransferSingle(on_transfer)
}, {
    per: () => App.token
});
Blockchain.onceConnect(async function onPptBatchTransfers({
    address, token
}) {
    const on_transfer: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (App.token !== token) {
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
                App.removePpt(ppt_id, { amount: values[i] });
            }
            if (address === to) {
                App.addPpt(ppt_id, { amount: values[i] });
            }
        }
    };
    const ppt_wallet = new PptWallet(address, token);
    ppt_wallet.onTransferBatch(on_transfer);
}, {
    per: () => App.token
});
Blockchain.onceConnect(async function updateClaims() {
    const moe_treasury = await MoeTreasuryFactory({
        token: App.token
    });
    moe_treasury.provider.on('block', buffered(() => {
        const $toggles = document.querySelectorAll<HTMLElement>(
            '.ppt-minter .toggle[data-state="on"]'
        );
        $toggles.forEach(($toggle) => {
            const $minter_on = ancestor($toggle, ($el) => {
                return $el.classList.contains('ppt-minter');
            });
            const $details = next($minter_on, ($el) => {
                return $el.classList.contains('nft-details');
            })
            const $rows_on = $details?.querySelectorAll<HTMLElement>(
                '.row.year[data-state="on"]'
            );
            $rows_on?.forEach(($el) => {
                $el.dispatchEvent(new Event('refresh-claims'));
            });
        });
    }));
});
