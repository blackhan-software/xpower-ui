import { Global } from '../../source/types';
declare const global: Global;

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { IntervalManager, MiningManager } from '../../source/managers';
import { clearMintingRows, removeNonces, setMintingRow } from '../../source/redux/actions';
import { Store } from '../../source/redux/store';
import { Page } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { OtfManager } from '../../source/wallet';
/**
 * minting:
 */
Store.onNonceChanged(async function updateMinters(
    nonce, { address, amount, token }, total
) {
    if (address !== await Blockchain.selectedAddress) {
        return;
    }
    if (token !== Store.getToken()) {
        return;
    }
    const level = Tokenizer.level(token, amount);
    const { tx_counter } = Store.getMintingRow({
        level
    });
    const min
        = Tokenizer.amount(token, App.level.min);
    const display
        = amount === min || total > 0n || tx_counter > 0n;
    Store.dispatch(setMintingRow({
        level, row: {
            disabled: !total, display,
            nn_counter: Number(total / amount),
        }
    }));
});
Store.onTokenSwitch(function resetMinters() {
    if (Page.Home !== Store.getPage()) {
        return;
    }
    Store.dispatch(clearMintingRows());
});
Store.onTokenSwitched(function forgetNonces() {
    if (Page.Home !== Store.getPage()) {
        return;
    }
    Store.dispatch(removeNonces());
});
Store.onPageSwitched(function forgetNonces(next, prev) {
    if (Page.Home !== prev) {
        return;
    }
    Store.dispatch(removeNonces());
});
Blockchain.onceConnect(function forgetNonces() {
    const im = new IntervalManager({ start: true });
    im.on('tick', () => Store.dispatch(removeNonces()));
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
        if (running && App.autoMint > 0) {
            global.MINTER_IID = setInterval(on_tick, App.autoMint);
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
    per: () => Store.getToken()
});
