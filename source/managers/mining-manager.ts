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
import { Account, Amount, BlockHash, Token } from '../redux/types';
import { Tokenizer } from '../token';
import { MoeWallet } from '../wallet';

MiningManager._miner = {} as Record<Token, Miner | undefined>;

export function MiningManager(
    api: MiddlewareAPI<Dispatch, AppState>
): {
    miner: (
        args: { account: Account; token: Token; }) => Miner;
    toggle: (
        args: { account: Account; token: Token; }) => Promise<void>;
} {
    function my_miner({ account, token }: {
        account: Account, token: Token
    }): Miner {
        const xtoken = Tokenizer.xify(token);
        let miner = MiningManager._miner[xtoken];
        if (miner === undefined) {
            const contract = addressOf({
                infix: 'MOE', token
            });
            const speed = miningSpeedBy(api.getState(), token);
            miner = MiningManager._miner[xtoken] = new Miner(
                token, contract, account, speed, ROParams.level.min
            );
        }
        return miner;
    }
    async function my_toggle({ account, token }: {
        account: Account, token: Token
    }): Promise<void> {
        const miner = my_miner({ account, token });
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
            token, version: ROParams.version
        });
        if (block_hash !== null) {
            const timestamp = HashManager.get(block_hash, {
                token, version: ROParams.version
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
        const moe_wallet = new MoeWallet(account, token);
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
            const { min, max } = range(token);
            if (miner.running) {
                await miner.stop();
            }
            miner.start(block_hash, ({
                amount, nonce, worker
            }) => {
                if (amount >= min && amount <= max) {
                    api.dispatch(addNonce(nonce, {
                        account,
                        amount,
                        block_hash,
                        token: Tokenizer.xify(token),
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
