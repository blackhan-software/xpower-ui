import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { x64 } from '../../source/functions';
import { HashManager, IntervalManager, MiningManager } from '../../source/managers';
import { MinerStatus, Token, Tokens } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { MoeWallet, OnInit, OtfManager } from '../../source/wallet';
/**
 * mining:
 */
Blockchain.onceConnect(function setupMining({
    address, token
}) {
    const miner = MiningManager.miner(address, {
        token
    });
    miner.on('initializing', () =>
        App.setMiningStatus({ status: MinerStatus.initializing }));
    miner.on('initialized', () =>
        App.setMiningStatus({ status: MinerStatus.initialized }));
    miner.on('starting', () =>
        App.setMiningStatus({ status: MinerStatus.starting }));
    miner.on('started', () =>
        App.setMiningStatus({ status: MinerStatus.started }));
    miner.on('stopping', () =>
        App.setMiningStatus({ status: MinerStatus.stopping }));
    miner.on('stopped', () =>
        App.setMiningStatus({ status: MinerStatus.stopped }));
    miner.on('pausing', () =>
        App.setMiningStatus({ status: MinerStatus.pausing }));
    miner.on('paused', () =>
        App.setMiningStatus({ status: MinerStatus.paused }));
    miner.on('resuming', () =>
        App.setMiningStatus({ status: MinerStatus.resuming }));
    miner.on('resumed', () =>
        App.setMiningStatus({ status: MinerStatus.resumed }));
    miner.on('increased', (e) =>
        App.setMiningSpeed({ speed: e.speed }));
    miner.on('decreased', (e) =>
        App.setMiningSpeed({ speed: e.speed }));
    App.setMiningStatus({
        status: MinerStatus.stopped
    });
}, {
    per: () => App.token
});
Blockchain.onConnect(function resetSpeed({
    address, token
}) {
    const miner = MiningManager.miner(address, {
        token
    });
    App.setMiningSpeed({ speed: miner.speed });
});
App.onPageSwitch(async function stopMining() {
    const address = await Blockchain.selectedAddress;
    if (address) {
        const miner = MiningManager.miner(address, {
            token: App.token
        });
        const running = miner.running;
        if (running) miner.stop();
    }
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
Blockchain.onceConnect(async function resumeMiningIf({
    address
}) {
    const on_block = async () => {
        if (OtfManager.enabled) {
            const otf_balance = await otf_wallet.getBalance();
            if (otf_balance.gt(OtfManager.threshold)) {
                const miner = MiningManager.miner(address, {
                    token: App.token
                });
                if (miner.running) {
                    miner.resume();
                }
            }
        }
    };
    const otf_wallet = await OtfManager.init();
    otf_wallet.provider?.on('block', on_block);
});
