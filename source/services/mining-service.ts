import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { x64 } from '../functions';
import { HashManager, IntervalManager, MiningManager as MM } from '../managers';
import { setMiningSpeed, setMiningStatus } from '../redux/actions';
import { onPageSwitch, onTokenSwitch } from '../redux/observers';
import { tokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { MinerStatus, Token, Tokens } from '../redux/types';
import { Tokenizer } from '../token';
import { MoeWallet, OnInit, OtfManager } from '../wallet';

export const MiningService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(function setupMining({
        address, token
    }) {
        const miner = MM(store).miner({
            address, token
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
            setMiningSpeed({ speed: { [token]: e.speed } })));
        miner.on('decreased', (e) => store.dispatch(
            setMiningSpeed({ speed: { [token]: e.speed } })));
        store.dispatch(
            setMiningStatus({ status: MinerStatus.stopped })
        );
    }, {
        per: () => tokenOf(store.getState())
    });
    onTokenSwitch(store, async function resetSpeed(token) {
        const address = await Blockchain.selectedAddress;
        if (address) {
            const miner = MM(store).miner({ address, token });
            store.dispatch(
                setMiningSpeed({ speed: { [token]: miner.speed } })
            );
        }
    })
    onPageSwitch(store, async function stopMining() {
        const address = await Blockchain.selectedAddress;
        if (address) {
            const miner = MM(store).miner({
                address, token: tokenOf(store.getState())
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
            const miner = MM(store).miner({
                address, token
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
        per: () => tokenOf(store.getState())
    });
    Blockchain.onceConnect(function restartMining({
        address
    }) {
        const im = new IntervalManager({ start: true });
        im.on('tick', async () => {
            const token = tokenOf(store.getState());
            const miner = MM(store).miner({
                address, token
            });
            const running = miner.running;
            if (running) {
                await miner.stop();
            }
            if (running) {
                MM(store).toggle({ address, token });
            }
        });
    });
    Blockchain.onceConnect(function benchmarkMining({
        address, token
    }) {
        const miner = MM(store).miner({ address, token });
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
        per: () => tokenOf(store.getState())
    });
    Blockchain.onceConnect(async function resumeMiningIf({
        address
    }) {
        const on_block = async () => {
            if (OtfManager.enabled) {
                const otf_balance = await otf_wallet.getBalance();
                if (otf_balance.gt(OtfManager.threshold)) {
                    const miner = MM(store).miner({
                        address, token: tokenOf(store.getState())
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
