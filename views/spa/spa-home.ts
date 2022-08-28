import { Global } from '../../source/types';
declare const global: Global;

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { x64 } from '../../source/functions';
import { HashManager } from '../../source/managers';
import { IntervalManager } from '../../source/managers';
import { MiningManager } from '../../source/managers';
import { Token, Tokens } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { MoeWallet, OtfWallet } from '../../source/wallet';
import { OnInit } from '../../source/wallet';
/**
 * mining:
 */
App.onPageSwitch(async function stopMining() {
    const address = await Blockchain.selectedAddress;
    if (address) {
        const miner = MiningManager.miner(address, {
            token: App.token
        });
        miner.stop();
    }
});
Blockchain.onceConnect(function refreshBlockHash({
    address, token
}) {
    const on_init: OnInit = async (block_hash, timestamp, ev) => {
        const contract = await moe_wallet.contract;
        if (contract.address === ev.address) {
            console.debug('[on:init]', x64(block_hash), timestamp, ev);
        } else {
            return;
        }
        const token_lc = Tokenizer.lower(token);
        HashManager.set(block_hash, timestamp, {
            slot: token_lc
        });
    };
    const moe_wallet = new MoeWallet(address, token);
    moe_wallet.onInit(on_init);
}, {
    per: () => App.token
});
Blockchain.onceConnect(function restartMining({
    address
}) {
    const im = new IntervalManager({ start: true });
    im.on('tick', async () => {
        const miner = MiningManager.miner(address, {
            token: App.token
        });
        const running = miner.running;
        if (running) {
            await miner.stop();
        }
        if (running) {
            MiningManager.toggle(address, {
                token: App.token
            });
        }
    });
});
Blockchain.onConnect(function stopMining({
    address
}) {
    for (const token of Tokens()) {
        if (token === Token.HELA) {
            continue;
        }
        const miner = MiningManager.miner(address, {
            token
        });
        const running = miner.running;
        if (running) miner.stop();
    }
});
Blockchain.onceConnect(function benchmarkMining({
    address, token
}) {
    const miner = MiningManager.miner(address, {
        token
    });
    miner.on('started', function (
        { now: beg_ms }: { now: number; }
    ) {
        miner.once('stopped', function (
            { now: end_ms }: { now: number; }
        ) {
            const ms = (end_ms - beg_ms).toFixed(3);
            console.debug('[mining.duration]', ms, '[ms]');
        });
    });
}, {
    per: () => App.token
});
/**
 * minting:
 */
App.onPageSwitched(function forgetNonce() {
    App.removeNonces();
});
App.onTokenSwitched(function forgetNonces() {
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
        if (OtfWallet.enabled) {
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
