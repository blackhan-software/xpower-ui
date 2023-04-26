/* eslint @typescript-eslint/no-var-requires: [off] */
if (typeof importScripts === 'function') importScripts(
    'https://cdn.jsdelivr.net/npm/react@18.1.0/umd/react.production.min.js',
    'https://cdn.jsdelivr.net/npm/ethers@6.3.0/dist/ethers.umd.min.js',
);

import { x40, x64, x64_plain } from '../../functions';
import { Account, Address, Amount, BlockHash, Interval, Level, Nonce, Token } from '../../redux/types';
import { Version } from '../../types';

import { AbiCoder, randomBytes } from 'ethers';
import { Observable } from 'observable-fns';
import { WorkerFunction, WorkerModule } from 'threads/dist/types/worker';
import { expose } from 'threads/worker';

const keccak = require('js-keccak-tiny/dist/node-bundle');
let keccak256: (array: Uint8Array) => string;
let worker: Worker | undefined;
let worker_id = 0;

export interface Miner extends Function {
    (nonce: Nonce, context: Context): string
}
export type Context = {
    token: Token,
    account: Account,
    block_hash: BlockHash,
    contract: Address,
    interval: Interval,
} & {
    callback?: (item: Item) => void,
};
export type IWorker = WorkerModule<keyof {
    identifier: WorkerFunction;
    init: WorkerFunction;
    start: WorkerFunction;
    pause: WorkerFunction;
    resume: WorkerFunction;
    stop: WorkerFunction;
    reset: WorkerFunction;
}>;
export type Item = {
    amount: Amount,
    nonce: Nonce,
};
expose({
    identifier() {
        return worker_id;
    },
    async init({
        account,
        contract,
        level,
        meta,
        token,
        version,
        versionFaked,
    }: {
        account: Account,
        contract: Address,
        level: Level,
        meta: { id: number },
        token: Token,
        version: Version,
        versionFaked: boolean,
    }) {
        if (worker !== undefined) {
            throw new Error(`worker already initialized`);
        } else {
            const { keccak256: hash } = await keccak();
            keccak256 = (a) => hash(a).toString('hex');
        }
        worker = new Worker({
            account,
            contract,
            level,
            meta,
            token,
            version,
            versionFaked
        });
        worker_id = meta.id;
    },
    start(
        block_hash: BlockHash
    ) {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        return new Observable<Item>((observer) => {
            worker?.start(block_hash, (i) => observer.next(i));
        });
    },
    pause() {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        worker.pause();
    },
    resume() {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        worker.resume();
    },
    stop() {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        worker.stop();
    },
    reset(
        block_hash: BlockHash
    ) {
        if (worker === undefined) {
            throw new Error(`no worker`);
        }
        worker.reset(block_hash);
    }
});
class Worker {
    public constructor({
        account,
        contract,
        level,
        meta,
        token,
        version,
        versionFaked,
    }: {
        account: Account,
        contract: Address,
        level: Level,
        meta: { id: number },
        token: Token,
        version: Version,
        versionFaked: boolean,
    }) {
        this._amount = amount(token, level);
        this._context = {
            account,
            block_hash: 0n,
            contract: normalize(contract),
            interval: interval(),
            token,
        };
        this._miner = miner(level, version, versionFaked);
        this._nonce = nonce(meta.id);
    }
    public start(
        block_hash: BlockHash,
        callback: (item: Item) => void
    ) {
        if (this.running) {
            throw new Error('already running');
        } else {
            this.context.block_hash = block_hash;
            this.context.callback = callback;
            this.running = true;
        }
        this.iid = this.loop(callback);
    }
    public pause() {
        if (this.iid) {
            clearInterval(this.iid);
            this.iid = undefined;
        }
    }
    public resume() {
        if (this.context.callback &&
            this.iid === undefined
        ) {
            this.iid = this.loop(
                this.context.callback
            );
        }
    }
    public stop() {
        this._running = false;
    }
    public reset(block_hash: BlockHash) {
        this.context.interval = interval();
        this.context.block_hash = block_hash;
    }
    private loop(callback: (item: Item) => void) {
        let khz = 100, dt = 1, dt_outer = 1, dt_inner = 0;
        const iid = setInterval(() => {
            dt_outer = performance.now() - dt_outer;
            if (this.running) {
                dt_inner = performance.now();
                const i_max = Math.ceil(khz);
                for (let i = 0; i < i_max; i++) {
                    const item = this.work();
                    if (item.amount > 0) {
                        callback(item);
                    }
                }
                dt_inner = performance.now() - dt_inner;
            } else {
                clearInterval(iid);
            }
            dt = 100 * dt_outer - dt_inner;
            if (Math.abs(dt) > 10) {
                khz += 100 / dt;
            }
            dt_outer = performance.now();
        });
        return iid;
    }
    private work() {
        const nonce = this.next_nonce;
        const amount = this.amount(
            this.miner(nonce, this.context)
        );
        return { amount, nonce };
    }
    private get amount() {
        return this._amount;
    }
    private get context() {
        return this._context;
    }
    private get iid() {
        return this._iid;
    }
    private set iid(value: NodeJS.Timer | undefined) {
        this._iid = value;
    }
    private get miner() {
        return this._miner;
    }
    private get next_nonce() {
        return this._nonce++;
    }
    private get running() {
        return this._running;
    }
    private set running(value: boolean) {
        this._running = value;
    }
    private _amount: (hash: string) => Amount;
    private _context: Context;
    private _iid?: NodeJS.Timer;
    private _miner: Miner;
    private _nonce: Nonce;
    private _running = false;
}
function normalize(
    address: Address
) {
    return x40(BigInt(address));
}
function interval() {
    const time = new Date().getTime();
    return Math.floor(time / 3_600_000);
}
function nonce(
    offset: number, length = 2 ** 48
) {
    const bytes = randomBytes(4);
    const view = new DataView(bytes.buffer);
    return view.getUint32(0) + offset * length;
}
function amount(
    token: Token, level: Level
) {
    const n_level = BigInt(level);
    switch (token) {
        case Token.THOR:
            return (hash: string) => {
                const lhs_zeros = zeros(hash);
                if (lhs_zeros >= n_level) {
                    return (lhs_zeros);
                }
                return 0n;
            };
        case Token.LOKI:
            return (hash: string) => {
                const lhs_zeros = zeros(hash);
                if (lhs_zeros >= n_level) {
                    return 2n ** (lhs_zeros) - 1n;
                }
                return 0n;
            };
        case Token.ODIN:
            return (hash: string) => {
                const lhs_zeros = zeros(hash);
                if (lhs_zeros >= n_level) {
                    return 16n ** (lhs_zeros) - 1n;
                }
                return 0n;
            };
        default:
            return (_hash: string) => 0n;
    }
}
function zeros(
    hash: string
) {
    const match = hash.match(/^(?<zeros>0+)/);
    if (match && match.groups) {
        return BigInt(match.groups.zeros.length);
    }
    return 0n;
}
function miner(
    level: Level, version: Version, version_faked: boolean
) {
    const abi_encode = abi_encoder(level, version, version_faked);
    return (nonce: Nonce, context: Context) => keccak256(
        abi_encode(nonce, context)
    );
}
function abi_encoder(
    level: Level, version: Version, versionFaked: boolean
) {
    const lazy_arrayify = arrayifier(level);
    const encoder_v2c = (nonce: Nonce, {
        account, block_hash, interval, token
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'string', 'uint256', 'address', 'uint256', 'bytes32'
            ], [
                symbol_v2c(token),
                0,
                x40(account),
                interval,
                x64(block_hash)
            ]);
            abi_encoded[interval] = value = arrayify(template.slice(2));
            array_cache[level] = arrayify(x64_plain(nonce));
            nonce_cache[level] = nonce;
        }
        const array = lazy_arrayify(nonce, x64_plain(nonce));
        value.set(array, 32);
        return value;
    };
    const encoder_v3b = (nonce: Nonce, {
        account, block_hash, interval, token
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'string', 'address', 'uint256', 'bytes32', 'uint256'
            ], [
                symbol_v3b(token),
                x40(account),
                interval,
                x64(block_hash),
                0
            ]);
            abi_encoded[interval] = value = arrayify(template.slice(2));
            array_cache[level] = arrayify(x64_plain(nonce));
            nonce_cache[level] = nonce;
        }
        const array = lazy_arrayify(nonce, x64_plain(nonce));
        value.set(array, 128);
        return value;
    };
    const encoder_v5b = (nonce: Nonce, {
        account, block_hash, interval, token
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'string', 'address', 'uint256', 'bytes32', 'uint256'
            ], [
                token,
                x40(account),
                interval,
                x64(block_hash),
                0
            ]);
            abi_encoded[interval] = value = arrayify(template.slice(2));
            array_cache[level] = arrayify(x64_plain(nonce));
            nonce_cache[level] = nonce;
        }
        const array = lazy_arrayify(nonce, x64_plain(nonce));
        value.set(array, 128);
        return value;
    };
    const encoder_v6a = (nonce: Nonce, {
        account, block_hash, contract, interval
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'address', 'address', 'uint256', 'bytes32', 'uint256'
            ], [
                contract,
                x40(account),
                interval,
                x64(block_hash),
                0
            ]);
            abi_encoded[interval] = value = arrayify(template.slice(2));
            array_cache[level] = arrayify(x64_plain(nonce));
            nonce_cache[level] = nonce;
        }
        const array = lazy_arrayify(nonce, x64_plain(nonce));
        value.set(array, 128);
        return value;
    };
    const encoder_v6b = (nonce: Nonce, {
        account, block_hash, contract, interval
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'address', 'address', 'bytes32', 'uint256'
            ], [
                contract,
                x40(account),
                x64(block_hash),
                0
            ]);
            abi_encoded[interval] = value = arrayify(template.slice(2));
            array_cache[level] = arrayify(x64_plain(nonce));
            nonce_cache[level] = nonce;
        }
        const array = lazy_arrayify(nonce, x64_plain(nonce));
        value.set(array, 96);
        return value;
    };
    if (versionFaked) {
        return encoder_v6b;
    }
    switch (version) {
        case Version.v2a:
        case Version.v2b:
        case Version.v2c:
            return encoder_v2c;
        case Version.v3a:
        case Version.v3b:
            return encoder_v3b;
        case Version.v4a:
        case Version.v5a:
        case Version.v5b:
            return encoder_v5b;
        case Version.v5c:
        case Version.v6a:
            return encoder_v6a;
        case Version.v6b:
        default:
            return encoder_v6b;
    }
    function symbol_v2c(token: Token) {
        if (token === Token.THOR) return 'XPOW.CPU';
        if (token === Token.LOKI) return 'XPOW.GPU';
        if (token === Token.ODIN) return 'XPOW.ASIC';
        return 'XPOW';
    }
    function symbol_v3b(token: Token) {
        if (token === Token.THOR) return 'PARA';
        if (token === Token.LOKI) return 'AQCH';
        if (token === Token.ODIN) return 'QRSH';
        return 'XPOW';
    }
}
function arrayifier(
    level: Level
) {
    const diff_max = 16n ** BigInt(level) - 1n;
    const offset_2 = 64 - Math.max(64, level * 2);
    const offset_1 = 32 - Math.max(32, level);
    return (nonce: Nonce, x64_nonce: string) => {
        if (nonce - nonce_cache[level] > diff_max) {
            array_cache[level] = arrayify(x64_nonce);
            nonce_cache[level] = nonce;
        }
        const array = arrayify(x64_nonce.slice(offset_2));
        array_cache[level].set(array, offset_1);
        return array_cache[level];
    };
}
function arrayify(
    data: string, list: number[] = []
) {
    for (let i = 0; i < data.length; i += 2) {
        list.push(parseInt(data.substring(i, i + 2), 16));
    }
    return new Uint8Array(list);
}
// cache: (interval: number) => abi.encode(token, nonce, ...)
const abi_encoded = {} as Record<Interval, Uint8Array>;
// cache: (level: number) => arrayify(x64-nonce)
const array_cache = {} as Record<Level, Uint8Array>;
// cache: (level: number) => nonce
const nonce_cache = {} as Record<Level, Nonce>;
