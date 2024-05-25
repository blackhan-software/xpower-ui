/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/no-require-imports: [off] */
/* eslint @typescript-eslint/no-unsafe-function-type: [off] */
if (typeof importScripts === 'function') importScripts(
    'https://cdn.jsdelivr.net/npm/react@18.1.0/umd/react.production.min.js',
    'https://cdn.jsdelivr.net/npm/ethers@6.3.0/dist/ethers.umd.min.js',
);

import { hex_bytes, x40, x64 } from '../../functions';
import { Account, Address, Amount, BlockHash, Interval, Level, Nonce } from '../../redux/types';
import { Version } from '../../types';

import { AbiCoder, randomBytes, solidityPacked } from 'ethers';
import { Observable } from 'observable-fns';
import { WorkerFunction, WorkerModule } from 'threads/dist/types/worker';
import { expose } from 'threads/worker';

import { KeccakHasher, IHasher } from 'wasm-miner';
let keccak_reduce: IHasher['reduce']; // miner
let worker: Worker | undefined;
let worker_id = 0;

export interface Miner extends Function {
    (nonce: Uint8Array, context: Context): Uint8Array
}
export type Context = {
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
        version,
        versionFaked,
    }: {
        account: Account,
        contract: Address,
        level: Level,
        meta: { id: number, idLength: number },
        version: Version,
        versionFaked: boolean,
    }) {
        if (worker !== undefined) {
            throw new Error(`worker already initialized`);
        } else {
            const keccak_hasher = await KeccakHasher();
            keccak_reduce = keccak_hasher.reduce;
        }
        worker = new Worker({
            account,
            contract,
            level,
            meta,
            version,
            versionFaked,
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
        version,
        versionFaked,
    }: {
        account: Account,
        contract: Address,
        level: Level,
        meta: { id: number, idLength: number },
        version: Version,
        versionFaked: boolean,
    }) {
        this._context = {
            account,
            block_hash: 0n,
            contract: normalize(contract),
            interval: interval(),
        };
        this._level = level;
        this._nonce = nonce(meta.id, meta.idLength);
        this._encoder = abi_encoder(version, versionFaked);
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
    private loop(
        callback: (item: Item) => void,
        frequency = 1e5, // loop.length
        period_ms = 1e2, // interval.ms
    ) {
        const abi_bytes = this.encoder(
            new Uint8Array(8), this.context
        );
        let min_nonce = this.nonce;
        let hertz = frequency, dt = 0;
        const iid = setInterval(() => {
            dt = performance.now();
            if (this.running) {
                const dlt_nonce = BigInt(Math.ceil(hertz));
                const max_nonce = min_nonce + dlt_nonce;
                keccak_reduce(abi_bytes, {
                    callback: (
                        nonce: bigint, zeros: number
                    ) => {
                        callback({
                            amount: amount_of(zeros),
                            nonce: hex_bytes(nonce)
                        });
                    },
                    range: [min_nonce, max_nonce],
                    zeros: this.level
                });
                min_nonce = max_nonce;
            } else {
                clearInterval(iid);
            }
            dt = performance.now() - dt;
            hertz *= 7 + period_ms / dt;
            hertz /= 8; // mov. average
        }, period_ms);
        return iid;
    }
    private get encoder() {
        return this._encoder;
    }
    private get context() {
        return this._context;
    }
    private get iid() {
        return this._iid;
    }
    private set iid(value: NodeJS.Timeout | undefined) {
        this._iid = value;
    }
    private get level() {
        return this._level;
    }
    private get nonce() {
        return number_of(this._nonce);
    }
    private get running() {
        return this._running;
    }
    private set running(value: boolean) {
        this._running = value;
    }
    private _encoder: (n: Uint8Array, c: Context) => Uint8Array;
    private _context: Context;
    private _iid?: NodeJS.Timeout;
    private _level: Level;
    private _nonce: Uint8Array;
    private _running = false;
}
function amount_of(level: Level) {
    return 2n ** BigInt(level) - 1n;
}
function number_of(array: Uint8Array) {
    const view = new DataView(array.buffer, 0);
    return view.getBigUint64(0);
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
    id: number, id_length: number, length = 8
) {
    const bytes = randomBytes(length);
    // basis in [0,32,...,224] (for id-length = 8)
    const basis = Math.floor(256 * id / id_length);
    // delta of [0,1,..,30,31] (for id-length = 8)
    const delta = bytes[length - 1] % Math.floor(256 / id_length);
    // strong uniformity with min. gap-sizes
    bytes[length - 1] = basis + delta;
    return bytes;
}
function abi_encoder(
    version: Version, versionFaked: boolean
) {
    const encoder_v1a = (nonce: Uint8Array, {
        account, interval,
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'uint256', 'address', 'uint256'
            ], [
                0,
                x40(account),
                interval
            ]);
            value = arrayify(template.slice(2));
            abi_encoded[interval] = value;
        }
        value.set(nonce, 32 - nonce.length);
        return value;
    };
    const encoder_v2c = (nonce: Uint8Array, {
        account, block_hash, interval
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'string', 'uint256', 'address', 'uint256', 'bytes32'
            ], [
                'XPOW.GPU',
                0,
                x40(account),
                interval,
                x64(block_hash)
            ]);
            value = arrayify(template.slice(2));
            abi_encoded[interval] = value;
        }
        value.set(nonce, 64 - nonce.length);
        return value;
    };
    const encoder_v3b = (nonce: Uint8Array, {
        account, block_hash, interval
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'string', 'address', 'uint256', 'bytes32', 'uint256'
            ], [
                'AQCH',
                x40(account),
                interval,
                x64(block_hash),
                0
            ]);
            value = arrayify(template.slice(2));
            abi_encoded[interval] = value;
        }
        value.set(nonce, 160 - nonce.length);
        return value;
    };
    const encoder_v5b = (nonce: Uint8Array, {
        account, block_hash, interval
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const abi = AbiCoder.defaultAbiCoder();
            const template = abi.encode([
                'string', 'address', 'uint256', 'bytes32', 'uint256'
            ], [
                'LOKI',
                x40(account),
                interval,
                x64(block_hash),
                0
            ]);
            value = arrayify(template.slice(2));
            abi_encoded[interval] = value;
        }
        value.set(nonce, 160 - nonce.length);
        return value;
    };
    const encoder_v6a = (nonce: Uint8Array, {
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
            value = arrayify(template.slice(2));
            abi_encoded[interval] = value;
        }
        value.set(nonce, 160 - nonce.length);
        return value;
    };
    const encoder_v7a = (nonce: Uint8Array, {
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
            value = arrayify(template.slice(2));
            abi_encoded[interval] = value;
        }
        value.set(nonce, 128 - nonce.length);
        return value;
    };
    const encoder_v7b = (nonce: Uint8Array, {
        account, block_hash, contract, interval
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const bytes28 = (bh: string) => {
                return '0x' + bh.slice(2).slice(0, -8);
            };
            const template = solidityPacked([
                'uint160', 'bytes28', 'uint256'
            ], [
                BigInt(contract) ^ account,
                bytes28(x64(block_hash)),
                0
            ]);
            value = arrayify(template.slice(2));
            abi_encoded[interval] = value;
        }
        value.set(nonce, 80 - nonce.length);
        return value;
    };
    const encoder_v7c = (nonce: Uint8Array, {
        account, block_hash, contract, interval
    }: Context) => {
        let value = abi_encoded[interval];
        if (value === undefined) {
            const template = solidityPacked([
                'uint160', 'bytes32', 'bytes'
            ], [
                BigInt(contract) ^ account,
                x64(block_hash),
                new Uint8Array(8)
            ]);
            value = arrayify(template.slice(2));
            abi_encoded[interval] = value;
        }
        value.set(nonce, 52);
        return value;
    };
    if (versionFaked) {
        return encoder_v7c;
    }
    switch (version) {
        case Version.v1a:
            return encoder_v1a;
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
        case Version.v6c:
        case Version.v7a:
            return encoder_v7a;
        case Version.v7b:
            return encoder_v7b;
        default:
            return encoder_v7c;
    }
}
function arrayify(
    data: string, list: number[] = []
) {
    for (let i = 0; i < data.length; i += 2) {
        list.push(parseInt(data.substring(i, i + 2), 16));
    }
    return new Uint8Array(list);
}
const abi_encoded = {} as Record<Interval, Uint8Array>;
