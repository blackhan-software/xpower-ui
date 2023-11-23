import { Global } from '../types';
declare const global: Global;

import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { inIframe, x32 } from '../functions';
import { HashManager, IntervalManager, MiningManager as MM } from '../managers';
import { ROParams } from '../params';
import { setMiningSpeed, setMiningStatus } from '../redux/actions';
import { onPageSwitch, onTokenSwitch } from '../redux/observers';
import { AppState } from '../redux/store';
import { MinerStatus } from '../redux/types';
import { MoeWallet, OnInit, OtfManager } from '../wallet';

export const MiningService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(function setupMining({
        account
    }) {
        const miner = MM(store).miner({
            account
        });
        miner.on('initializing', () =>
            set_status({ status: MinerStatus.initializing }));
        miner.on('initialized', () =>
            set_status({ status: MinerStatus.initialized }));
        miner.on('starting', () =>
            set_status({ status: MinerStatus.starting }));
        miner.on('started', () =>
            set_status({ status: MinerStatus.started }));
        miner.on('stopping', () =>
            set_status({ status: MinerStatus.stopping }));
        miner.on('stopped', () =>
            set_status({ status: MinerStatus.stopped }));
        miner.on('pausing', () =>
            set_status({ status: MinerStatus.pausing }));
        miner.on('paused', () =>
            set_status({ status: MinerStatus.paused }));
        miner.on('resuming', () =>
            set_status({ status: MinerStatus.resuming }));
        miner.on('resumed', () =>
            set_status({ status: MinerStatus.resumed }));
        miner.on('increased', (e) =>
            set_speed({ speed: e.speed }));
        miner.on('decreased', (e) =>
            set_speed({ speed: e.speed }));
        function set_status({ status }: { status: MinerStatus }) {
            const inits = [
                MinerStatus.initializing, MinerStatus.initialized
            ];
            if (!inIframe() || !inits.includes(status)) {
                store.dispatch(setMiningStatus({ status }));
            }
        }
        function set_speed({ speed }: { speed: number }) {
            store.dispatch(setMiningSpeed({ speed }));
        }
        set_status({ status: MinerStatus.stopped })
    });
    onPageSwitch(store, async function stopMining() {
        const account = await Blockchain.account;
        if (account) {
            const miner = MM(store).miner({
                account
            });
            const running = miner.running;
            if (running) miner.stop();
        }
    });
    onTokenSwitch(store, async function resetSpeed() {
        const account = await Blockchain.account;
        if (account) {
            const miner = MM(store).miner({ account });
            store.dispatch(
                setMiningSpeed({ speed: miner.speed })
            );
        }
    });
    Blockchain.onceConnect(function refreshBlockHash({
        account
    }) {
        const on_init: OnInit = async (block_hash, timestamp, ev) => {
            console.debug('[on:init]', x32(block_hash), timestamp, ev);
            HashManager.set(block_hash, timestamp, {
                version: ROParams.version
            });
        };
        const moe_wallet = new MoeWallet(account);
        moe_wallet.onInit(on_init);
    });
    Blockchain.onceConnect(function restartMining({
        account
    }) {
        const im = global.IM = new IntervalManager({
            start: true
        });
        im.on('tick', async () => {
            const miner = MM(store).miner({
                account
            });
            const running = miner.running;
            if (running) {
                await miner.stop();
            }
            if (running) setTimeout(() => {
                MM(store).toggle({ account });
            }, 600);
        });
    });
    Blockchain.onceConnect(function benchmarkMining({
        account
    }) {
        const miner = MM(store).miner({ account });
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
    });
    Blockchain.onceConnect(async function resumeMiningIf({
        account
    }) {
        const on_block = async () => {
            if (OtfManager.enabled) {
                const otf_balance = await OtfManager.getBalance();
                if (otf_balance > OtfManager.threshold) {
                    const miner = MM(store).miner({
                        account
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
}
export default MiningService;
