import { Global } from '../../source/types';
declare const global: Global;

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { IntervalManager } from '../../source/managers';
import { MiningManager } from '../../source/managers';
import { MinterRows } from '../../source/redux/types';
import { Page } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { OtfManager } from '../../source/wallet';
/**
 * minting:
 */
App.onNonceChanged(async function updateMinters(
    nonce, { address, amount, token }, total
) {
    if (address !== await Blockchain.selectedAddress) {
        return;
    }
    if (token !== App.token) {
        return;
    }
    const { rows } = App.getMinting();
    const level = Tokenizer.level(token, amount);
    const { tx_counter } = MinterRows.get(rows, level - 1);
    const amount_min = Tokenizer.amount(token, App.level.min);
    const row = {
        disabled: !total,
        display: amount === amount_min || total > 0n || tx_counter > 0n,
        nn_counter: Number(total / amount),
    };
    App.setMinting({
        rows: MinterRows.set(rows, level - 1, row)
    });
});
App.onTokenSwitch(function resetMinters() {
    if (Page.Home !== App.page) {
        return;
    }
    App.setMinting({
        rows: MinterRows.init(App.level.min)
    });
});
App.onTokenSwitched(function forgetNonces() {
    if (Page.Home !== App.page) {
        return;
    }
    App.removeNonces();
});
App.onPageSwitched(function forgetNonces(next, prev) {
    if (Page.Home !== prev) {
        return;
    }
    App.removeNonces();
});
Blockchain.onceConnect(function forgetNonces() {
    const im = new IntervalManager({ start: true });
    im.on('tick', () => App.removeNonces());
});
Blockchain.onceConnect(function autoMint({
    address, token
}) {
    const miner = MiningManager.miner(address, {
        token
    });
    miner.on('stopping', () => {
        if (global.MINTER_IID) {
            clearInterval(global.MINTER_IID);
            delete global.MINTER_IID;
        }
    });
    miner.on('started', ({ running }: {
        running: boolean;
    }) => {
        if (global.MINTER_IID) {
            clearInterval(global.MINTER_IID);
            delete global.MINTER_IID;
        }
        if (running && App.auto_mint > 0) {
            global.MINTER_IID = setInterval(on_tick, App.auto_mint);
        }
    });
    function on_tick() {
        if (OtfManager.enabled) {
            const $minters = document.querySelectorAll<HTMLElement>(
                '.minter'
            );
            for (const $minter of $minters) {
                if ($minter.getAttribute('disabled') === null) {
                    $minter.click();
                }
            }
        }
    }
}, {
    per: () => App.token
});
