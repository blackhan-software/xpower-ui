/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/no-var-requires: [off] */
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

import { createKeccak } from 'hash-wasm';
let keccak: (array: Uint8Array) => Uint8Array;
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
            const keccak_hasher = await createKeccak(256);
            keccak = (a) => keccak_hasher.init().update(a).digest('binary');
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
        this._amount = amount(level);
        this._context = {
            account,
            block_hash: 0n,
            contract: normalize(contract),
            interval: interval(),
        };
        this._miner = miner(version, versionFaked);
        this._nonce = nonce(meta.id, meta.idLength);
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
                    if (item.amount > 0n) {
                        const view = new DataView(item.nonce.buffer, 0);
                        const nonce = hex_bytes(view.getBigUint64(0));
                        callback({ ...item, nonce });
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
        return increment(this._nonce);
    }
    private get running() {
        return this._running;
    }
    private set running(value: boolean) {
        this._running = value;
    }
    private _amount: (hash: Uint8Array) => Amount;
    private _context: Context;
    private _iid?: NodeJS.Timer;
    private _miner: Miner;
    private _nonce: Uint8Array;
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
function increment(
    nonce: Uint8Array, index = 0
): Uint8Array {
    if (nonce[index]++) {
        return nonce;
    }
    return increment(
        nonce, (index + 1) % nonce.length
    );
}
function amount(
    level: Level
) {
    return (hash: Uint8Array) => {
        const lhs_zeros = zeros(hash);
        if (lhs_zeros >= level) {
            return 2n ** BigInt(lhs_zeros) - 1n;
        }
        return 0n;
    };
}
function zeros(
    hash: Uint8Array, counter = 0
) {
    while (hash[counter] === 0) {
        counter++;
    }
    if (hash[counter] < 16) {
        return 2 * counter + 1;
    } else {
        return 2 * counter;
    }
}
function miner(
    version: Version, version_faked: boolean
) {
    const abi_encode = abi_encoder(version, version_faked);
    return (nonce: Uint8Array, context: Context) => keccak(
        abi_encode(nonce, context)
    );
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
// cache: (interval: number) => abi.encode(token, nonce, ...)
const abi_encoded = {} as Record<Interval, Uint8Array>;
