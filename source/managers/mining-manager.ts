/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';
import { HashManager, IntervalManager } from '.';
import { address as addressOf } from '../contract/address';
import { error } from '../functions';
import { Miner } from '../miner';
import { ROParams } from '../params';
import { addNonce } from '../redux/actions';
import { miningSpeedBy } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Account, Amount, BlockHash } from '../redux/types';
import { Tokenizer } from '../token';
import { MoeWallet } from '../wallet';

MiningManager._miner = undefined as Miner | undefined;

export function MiningManager(
    api: MiddlewareAPI<Dispatch, AppState>
): {
    miner: (
        args: { account: Account }) => Miner;
    toggle: (
        args: { account: Account }) => Promise<void>;
} {
    function my_miner({ account, }: {
        account: Account
    }): Miner {
        let miner = MiningManager._miner;
        if (miner === undefined) {
            const contract = addressOf({
                prefix: 'XPOW', infix: 'MOE'
            });
            const speed = miningSpeedBy(api.getState());
            miner = MiningManager._miner = new Miner(
                contract, account, speed ?? undefined, ROParams.level.min
            );
        }
        return miner;
    }
    async function my_toggle({ account }: {
        account: Account
    }): Promise<void> {
        const miner = my_miner({ account });
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
            version: ROParams.version
        });
        if (block_hash !== null) {
            const timestamp = HashManager.get(block_hash, {
                version: ROParams.version
            });
            if (timestamp !== null) {
                const interval = IntervalManager.intervalFrom(
                    new Date(Number(timestamp) * 1000)
                );
                if (interval === IntervalManager.interval) {
                    return mine(account, block_hash);
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
            mine(account, block_hash);
        });
        const moe_wallet = new MoeWallet(account);
        try {
            const init = await moe_wallet.init();
            console.debug('[init]', init);
        } catch (ex: any) {
            HashManager.me.removeAllListeners('block-hash');
            miner.emit('initialized', { block_hash: null });
            throw error(ex);
        }
        async function mine(
            account: Account, block_hash: BlockHash
        ) {
            miner.emit('initialized', { block_hash });
            const { mint, max } = range();
            if (miner.running) {
                await miner.stop();
            }
            miner.start(block_hash, ({
                amount, nonce, worker
            }) => {
                if (amount >= mint && amount <= max) {
                    api.dispatch(addNonce(nonce, {
                        account,
                        amount,
                        block_hash,
                        worker,
                    }));
                }
            });
        }
    }
    return { miner: my_miner, toggle: my_toggle };
}
function range(): { mint: Amount, max: Amount } {
    const mint = Tokenizer.amount(ROParams.level.mint);
    const max = Tokenizer.amount(ROParams.level.max);
    return { mint, max };
}
export default MiningManager;
