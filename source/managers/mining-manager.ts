/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';
import { HashManager, IntervalManager } from '.';
import { alert, Alert, Alerts } from '../functions';
import { Miner } from '../miner';
import { ROParams } from '../params';
import { addNonce } from '../redux/actions';
import { miningSpeedBy } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Address, Amount, BlockHash, Token } from '../redux/types';
import { Tokenizer } from '../token';
import { MoeWallet } from '../wallet';

MiningManager._miner = {} as Record<Token, Miner | undefined>;

export function MiningManager(
    api: MiddlewareAPI<Dispatch, AppState>
): {
    miner: (args: { address: Address; token: Token; }) => Miner;
    toggle: (args: { address: Address; token: Token; }) => Promise<void>;
} {
    function my_miner({ address, token }: {
        address: Address, token: Token
    }): Miner {
        let miner = MiningManager._miner[token];
        if (miner === undefined) {
            const speed = miningSpeedBy(api.getState(), token);
            miner = MiningManager._miner[token] = new Miner(
                token, address, speed, ROParams.level.min
            );
        }
        return miner;
    }
    async function my_toggle({ address, token }: {
        address: Address, token: Token
    }): Promise<void> {
        const token_lc = Tokenizer.lower(token);
        const miner = my_miner({ address, token });
        Alerts.hide();
        if (miner.running) {
            return await miner.stop();
        }
        miner.emit('initializing', {
            block_hash: null
        });
        //
        // if: recent(block-hash?) => mine
        //
        const block_hash = HashManager.latestHash({
            slot: token_lc
        });
        if (block_hash !== null) {
            const timestamp = HashManager.get(block_hash, {
                slot: token_lc
            });
            if (timestamp !== null) {
                const interval = IntervalManager.intervalFrom(
                    new Date(Number(timestamp) * 1000)
                );
                if (interval === IntervalManager.interval) {
                    return mine(address, block_hash);
                }
            }
        }
        //
        // else: !recent(block-hash?) => init & mine
        //
        HashManager.me.once('block-hash', ({
            block_hash
        }: {
            block_hash: BlockHash;
        }) => {
            mine(address, block_hash);
        });
        const moe_wallet = new MoeWallet(address, token);
        try {
            const init = await moe_wallet.init();
            console.debug('[init]', init);
        } catch (ex: any) {
            /* eslint no-ex-assign: [off] */
            if (ex.error) {
                ex = ex.error;
            }
            if (ex.message) {
                if (ex.data && ex.data.message) {
                    ex.message = `${ex.message} [${ex.data.message}]`;
                }
                const $toggle = document.getElementById('toggle-mining');
                alert(ex.message, Alert.warning, {
                    style: { margin: '0.5em 0 -0.5em 0' },
                    after: $toggle?.parentElement
                });
            }
            HashManager.me.removeAllListeners('block-hash');
            miner.emit('initialized', { block_hash: null });
            console.error(ex);
        }
        async function mine(
            address: Address, block_hash: BlockHash
        ) {
            miner.emit('initialized', { block_hash });
            const { min, max } = range(token);
            if (miner.running) {
                await miner.stop();
            }
            miner.start(block_hash, ({
                amount, nonce, worker
            }) => {
                if (amount >= min && amount <= max) {
                    api.dispatch(addNonce(nonce, {
                        address,
                        amount,
                        block_hash,
                        token,
                        worker,
                    }));
                }
            });
        }
    }
    return { miner: my_miner, toggle: my_toggle };
}
function range(token: Token): { min: Amount, max: Amount } {
    const min = Tokenizer.amount(token, ROParams.level.min);
    const max = Tokenizer.amount(token, ROParams.level.max);
    return { min, max };
}
export default MiningManager;
