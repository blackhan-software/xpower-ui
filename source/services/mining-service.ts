import { Global } from '../types';
declare const global: Global;

import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { x32 } from '../functions';
import { HashManager, IntervalManager, MiningManager as MM } from '../managers';
import { ROParams } from '../params';
import { setMiningSpeed, setMiningStatus } from '../redux/actions';
import { onPageSwitch, onTokenSwitch } from '../redux/observers';
import { xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { MinerStatus } from '../redux/types';
import { Tokenizer } from '../token';
import { MoeWallet, OnInit, OtfManager } from '../wallet';

export const MiningService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(function setupMining({
        account, token
    }) {
        const miner = MM(store).miner({
            account, token
        });
        miner.on('initializing', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.initializing })));
        miner.on('initialized', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.initialized })));
        miner.on('starting', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.starting })));
        miner.on('started', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.started })));
        miner.on('stopping', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.stopping })));
        miner.on('stopped', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.stopped })));
        miner.on('pausing', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.pausing })));
        miner.on('paused', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.paused })));
        miner.on('resuming', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.resuming })));
        miner.on('resumed', () => store.dispatch(
            setMiningStatus({ status: MinerStatus.resumed })));
        miner.on('increased', (e) => store.dispatch(
            setMiningSpeed({ speed: { [miner.token]: e.speed } })));
        miner.on('decreased', (e) => store.dispatch(
            setMiningSpeed({ speed: { [miner.token]: e.speed } })));
        store.dispatch(
            setMiningStatus({ status: MinerStatus.stopped })
        );
    }, {
        per: () => xtokenOf(store.getState())
    });
    onPageSwitch(store, async function stopMining() {
        const account = await Blockchain.account;
        if (account) {
            const miner = MM(store).miner({
                account, token: xtokenOf(store.getState())
            });
            const running = miner.running;
            if (running) miner.stop();
        }
    });
    onTokenSwitch(store, async function stopMining(token, oldToken) {
        if (Tokenizer.similar(token, oldToken)) {
            return;
        }
        const account = await Blockchain.account;
        if (account) {
            const miner = MM(store).miner({
                account, token: oldToken
            });
            const running = miner.running;
            if (running) miner.stop();
        }
    });
    onTokenSwitch(store, async function resetSpeed(token) {
        const account = await Blockchain.account;
        if (account) {
            const miner = MM(store).miner({ account, token });
            store.dispatch(
                setMiningSpeed({ speed: { [token]: miner.speed } })
            );
        }
    });
    Blockchain.onceConnect(function refreshBlockHash({
        account, token
    }) {
        const on_init: OnInit = async (block_hash, timestamp, ev) => {
            console.debug('[on:init]', x32(block_hash), timestamp, ev);
            HashManager.set(block_hash, timestamp, {
                token: Tokenizer.xify(token), version: ROParams.version
            });
        };
        const moe_wallet = new MoeWallet(account, token);
        moe_wallet.onInit(on_init);
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(function restartMining({
        account
    }) {
        const im = global.IM = new IntervalManager({
            start: true
        });
        im.on('tick', async () => {
            const token = xtokenOf(store.getState());
            const miner = MM(store).miner({
                account, token
            });
            const running = miner.running;
            if (running) {
                await miner.stop();
            }
            if (running) setTimeout(() => {
                MM(store).toggle({ account, token });
            }, 600);
        });
    });
    Blockchain.onceConnect(function benchmarkMining({
        account, token
    }) {
        const miner = MM(store).miner({ account, token });
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
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(async function resumeMiningIf({
        account
    }) {
        const on_block = async () => {
            if (OtfManager.enabled) {
                const otf_balance = await OtfManager.getBalance();
                if (otf_balance > OtfManager.threshold) {
                    const miner = MM(store).miner({
                        account, token: xtokenOf(store.getState())
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
