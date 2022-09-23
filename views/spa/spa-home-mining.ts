import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { x64 } from '../../source/functions';
import { HashManager } from '../../source/managers';
import { IntervalManager } from '../../source/managers';
import { MiningManager } from '../../source/managers';
import { MinerStatus } from '../../source/redux/types';
import { Token, Tokens } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { MoeWallet } from '../../source/wallet';
import { OnInit } from '../../source/wallet';

Blockchain.onceConnect(function setupMining({
    address, token
}) {
    const miner = MiningManager.miner(address, {
        token
    });
    miner.on('initializing', () => App.setMining({
        status: MinerStatus.initializing
    }));
    miner.on('initialized', () => App.setMining({
        status: MinerStatus.initialized
    }));
    miner.on('starting', () => App.setMining({
        status: MinerStatus.starting
    }));
    miner.on('started', () => App.setMining({
        status: MinerStatus.started
    }));
    miner.on('stopping', () => App.setMining({
        status: MinerStatus.stopping
    }));
    miner.on('stopped', () => App.setMining({
        status: MinerStatus.stopped
    }));
    miner.on('pausing', () => App.setMining({
        status: MinerStatus.pausing
    }));
    miner.on('paused', () => App.setMining({
        status: MinerStatus.paused
    }));
    miner.on('resuming', () => App.setMining({
        status: MinerStatus.resuming
    }));
    miner.on('resumed', () => App.setMining({
        status: MinerStatus.resumed
    }));
    miner.on('increased', (e) => App.setMining({
        speed: e.speed
    }));
    miner.on('decreased', (e) => App.setMining({
        speed: e.speed
    }));
    App.setMining({
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
    App.setMining({ speed: miner.speed });
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
