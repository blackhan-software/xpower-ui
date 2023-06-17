import { EventEmitter } from 'events';
import { ModuleThread, spawn, Thread, Worker } from 'threads';
import { logical_cpus } from '../functions';
import { ROParams } from '../params';
import { Account, Address, Amount, BlockHash, Level, Nonce, Token } from '../redux/types';
import { Tokenizer } from '../token';
import { Version } from '../types';
import { Item, IWorker } from './scripts/worker';

import { Global } from '../types';
export declare const global: Global;

export type OnMined = ({ nonce, amount, worker }: {
    nonce: Nonce, amount: Amount, worker: number
}) => void;

export class Miner extends EventEmitter {
    public static SPEED_DEFAULT = 0.5; // [0..1]
    public static WORKERS_MAX = logical_cpus();
    public constructor(
        /** token to mine for */
        token: Token,
        /** contract to mine on */
        contract: Address,
        /** account to mine for */
        account: Account,
        /** speed to mine with */
        speed = Miner.SPEED_DEFAULT,
        /** min. level to mine at */
        level: Level = 1,
        /** version to mine for */
        version = ROParams.version,
        /** version to fake instead  */
        versionFaked = ROParams.versionFaked
    ) {
        super();
        this._account = account;
        this._contract = contract;
        this._level = level;
        this._speed = speed;
        this._token = Tokenizer.xify(token);
        this._version = version;
        this._versionFaked = versionFaked;
        this.setMaxListeners(20);
    }
    public get running(): boolean {
        return this.workers.length > 0;
    }
    public async start(block_hash: BlockHash, callback: OnMined) {
        if (this.running) {
            throw new Error(`miner is running`);
        }
        this.emit('starting', {
            running: false, now: performance.now()
        });
        for (let i = 0; i < this.workersLength; i++) {
            this.workers.push(await this.hire(i));
        }
        this.emit('started', {
            running: this.running, now: performance.now()
        });
        for (let i = 0; i < this.workers.length; i++) {
            const observer = this.workers[i].start(block_hash);
            observer.subscribe((item: Item) => callback({
                ...item, worker: i
            }));
        }
        this._paused = false;
    }
    public async pause() {
        if (this._paused === false) {
            this._paused = true;
        } else {
            return;
        }
        this.emit('pausing', {
            running: this.running, now: performance.now()
        });
        for (const worker of this.workers) {
            await worker.pause();
        }
        this.emit('paused', {
            running: this.running, now: performance.now()
        });
    }
    public async resume() {
        if (this._paused) {
            this._paused = false;
        } else {
            return;
        }
        this.emit('resuming', {
            running: this.running, now: performance.now()
        });
        for (const worker of this.workers) {
            await worker.resume();
        }
        this.emit('resumed', {
            running: this.running, now: performance.now()
        });
    }
    public async stop() {
        this.emit('stopping', {
            running: this.running, now: performance.now()
        });
        while (this.workers.length > 0) {
            await this.fire();
        }
        this.emit('stopped', {
            running: this.running, now: performance.now()
        });
        this._paused = false;
    }
    public increase(by = 1 / Miner.WORKERS_MAX): number {
        const old_speed = this.speed;
        this.speed += by;
        const new_value = this.speed;
        if (new_value !== old_speed) {
            this.emit('increased', {
                speed: new_value
            });
        }
        return new_value;
    }
    public decrease(by = 1 / Miner.WORKERS_MAX): number {
        const old_speed = this.speed;
        this.speed -= by;
        const new_value = this.speed;
        if (new_value !== old_speed) {
            this.emit('decreased', {
                speed: new_value
            });
        }
        return new_value;
    }
    private async hire(id: number) {
        let thread: ModuleThread<IWorker>;
        const path_dev = './scripts/worker.js';
        try {
            const path_pro = $('#g-worker-path').data('value');
            const head_pro = await fetch(path_pro, { method: 'HEAD' });
            if (head_pro.ok) {
                const worker = new Worker(path_pro, {
                    workerData: {
                        'hash-wasm': require('hash-wasm'),
                        'ethers': require('ethers'),
                        'react': require('react'),
                    }
                });
                thread = await spawn<IWorker>(worker);
            } else {
                const worker = new Worker(path_dev, {
                    workerData: {
                        'hash-wasm': require('hash-wasm'),
                        'ethers': require('ethers'),
                        'react': require('react'),
                    }
                });
                thread = await spawn<IWorker>(worker);
            }
        } catch (ex) {
            const worker = new Worker(path_dev);
            thread = await spawn<IWorker>(worker);
        }
        await thread.init({
            account: this.account,
            contract: this.contract,
            level: this.level,
            meta: { id, idLength: this.workersLength },
            token: this.token,
            version: this.version,
            versionFaked: this.versionFaked
        });
        return thread;
    }
    private async fire() {
        const worker = this.workers.pop() as ModuleThread<IWorker>;
        await worker.stop(); await Thread.terminate(worker);
    }
    private get account() {
        return this._account;
    }
    private get contract() {
        return this._contract;
    }
    private get level() {
        return this._level;
    }
    public get speed() {
        return this._speed;
    }
    private set speed(value: number) {
        this._speed = value;
    }
    public get token(): Token {
        return this._token;
    }
    public get version(): Version {
        return this._version;
    }
    private get versionFaked(): boolean {
        return this._versionFaked;
    }
    private get workers(): ModuleThread<IWorker>[] {
        return this._workers;
    }
    public get workersLength(): number {
        return Miner.WORKERS_MAX * this.speed
    }
    private _account: Account;
    private _contract: Address;
    private _level: Level;
    private _paused = false;
    private _speed: number;
    private _token: Token;
    private _version: Version;
    private _versionFaked: boolean;
    private _workers: ModuleThread<IWorker>[] = [];
}
export default Miner;
