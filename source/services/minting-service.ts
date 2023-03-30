import { Global } from '../types';
declare const global: Global;

import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { IntervalManager, MiningManager as MM } from '../managers';
import { ROParams } from '../params';
import { clearMintingRows, removeNonces, setMintingRow } from '../redux/actions';
import { onNonceChanged, onPageSwitch, onTokenSwitch } from '../redux/observers';
import { mintingRowBy, pageOf, xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Page } from '../redux/types';
import { Tokenizer } from '../token';
import { OtfManager } from '../wallet';

export const MintingService = (
    store: Store<AppState>
) => {
    onNonceChanged(store, async function updateMinters(
        nonce, { address, amount, token }, total
    ) {
        if (address !== await Blockchain.selectedAddress) {
            return;
        }
        if (token !== xtokenOf(store.getState())) {
            return;
        }
        const level = Tokenizer.level(token, amount);
        const { tx_counter } = mintingRowBy(store.getState(), level);
        const min_amount = Tokenizer.amount(
            token, ROParams.level.min
        );
        const display =
            amount === min_amount ||
            total > 0n || tx_counter > 0n;
        store.dispatch(setMintingRow({
            level, row: {
                disabled: !total, display,
                nn_counter: Number(total / amount),
            }
        }));
    });
    onPageSwitch(store, function forgetNonces(next, prev) {
        if (Page.Home !== prev) {
            return;
        }
        store.dispatch(removeNonces());
    });
    onTokenSwitch(store, function forgetNonces(token, oldToken) {
        if (Page.Home !== pageOf(store.getState())) {
            return;
        }
        if (Tokenizer.similar(token, oldToken)) {
            return;
        }
        store.dispatch(removeNonces());
    });
    onTokenSwitch(store, function resetMinters(token, oldToken) {
        if (Page.Home !== pageOf(store.getState())) {
            return;
        }
        if (Tokenizer.similar(token, oldToken)) {
            return;
        }
        store.dispatch(clearMintingRows());
    });
    Blockchain.onceConnect(function forgetNonces() {
        const im = new IntervalManager({ start: true });
        im.on('tick', () => store.dispatch(removeNonces()));
    });
    Blockchain.onceConnect(function autoMint({
        address, token
    }) {
        const miner = MM(store).miner({ address, token });
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
            const auto_mint = ROParams.autoMint;
            if (running && auto_mint > 0) {
                global.MINTER_IID = setInterval(on_tick, auto_mint);
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
        per: () => xtokenOf(store.getState())
    });
}
export default MintingService;
