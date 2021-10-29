import { defaultAbiCoder as abi } from 'ethers/lib/utils';
import { keccak256 } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { EventEmitter } from 'events';

export type OnMined = (
    nonce: BigNumber, amount: BigNumber
) => void;
export type OnInterval = (
    new_interval: BigNumber, old_interval: BigNumber
) => void;

export class Miner extends EventEmitter {
    private static SPEED_DEFAULT = 0.5; // [0..1]
    private static FREQUENCY_DEFAULT = 10; // per ms
    private static INTERVAL_DEFAULT = 3_600_000; // 1 hour
    public constructor(
        /** address to mine for */
        address: string,
        /** initial speed of mining (in [0..1]) */
        speed = Miner.SPEED_DEFAULT,
        /** initial loops per millisecond (in [0..]) */
        frequency = Miner.FREQUENCY_DEFAULT,
        /** interval in milliseconds (in [0..]) */
        interval = Miner.INTERVAL_DEFAULT,
    ) {
        super();
        if (typeof address !== 'string') {
            throw new Error('address not a string');
        }
        if (!address.match(/^0x/)) {
            throw new Error('address prefix not 0x')
        }
        if (typeof speed !== 'number') {
            throw new Error('speed not a number');
        }
        if (speed !== minmax(speed, 0, 1)) {
            throw new Error('speed not in range [0..1]');
        }
        if (typeof frequency !== 'number') {
            throw new Error('frequency not a number');
        }
        if (frequency < 0) {
            throw new Error('frequency not positive');
        }
        if (typeof interval !== 'number') {
            throw new Error('interval not a number');
        }
        if (interval < 0) {
            throw new Error('interval not positive');
        }
        this._address = address;
        this._speed = speed;
        this._frequency = frequency;
        this._interval = interval;
    }
    public get running(): boolean {
        return this.mining_iid !== undefined;
    }
    public start(callback: OnMined): void {
        if (this.running) {
            this.stop();
        }
        this.mining_iid = setInterval(() => {
            this.frequency = this.mine(this.frequency, callback);
        });
        this.emit('started', {
            running: this.running
        });
    }
    public stop(): void {
        if (this.mining_iid !== undefined) {
            clearInterval(this.mining_iid);
            this.mining_iid = undefined;
        }
        this.emit('stopped', {
            running: this.running
        });
        this.frequency = Miner.FREQUENCY_DEFAULT;
    }
    public accelerate(by = 0.25): number {
        const old_speed = this.speed;
        this.speed += by;
        const new_speed = this.speed;
        if (new_speed !== old_speed) {
            this.emit('accelerated', {
                speed: new_speed
            });
        }
        return new_speed;
    }
    public decelerate(by = 0.25): number {
        const old_speed = this.speed;
        this.speed -= by;
        const new_speed = this.speed;
        if (new_speed !== old_speed) {
            this.emit('decelerated', {
                speed: new_speed
            });
        }
        return new_speed;
    }
    public onInterval(
        callback: OnInterval, poll_ms = 1000
    ): NodeJS.Timer {
        let old_interval: BigNumber;
        let new_interval = this.current_interval;
        return setInterval(() => {
            old_interval = BigNumber.from(new_interval);
            new_interval = this.current_interval;
            if (!new_interval.eq(old_interval)) {
                callback(new_interval, old_interval);
            }
        }, poll_ms);
    }
    private mine(
        frequency: number, callback: OnMined
    ) {
        for (let i = 0; i < Math.ceil(frequency * this.speed); i++) {
            const { nonce, amount, ms } = this.work_timed();
            const new_frequency = ms > 0.0 ? 1 / ms : 0;
            frequency = (2 * frequency + new_frequency) / 3;
            frequency = Math.ceil(frequency); // >= 1.0
            callback(nonce, amount);
        }
        return frequency;
    }
    private work_timed() {
        const start = performance.now();
        const { nonce, amount } = this.work();
        const ended = performance.now();
        return {
            nonce, amount, ms: ended - start
        };
    }
    private work() {
        const [nonce, address, interval] = [
            this.next_nonce, this.address, this.current_interval
        ];
        const amount = this.amount(this.hash(
            nonce, address, interval
        ));
        return { nonce, amount };
    }
    private get next_nonce(): BigNumber {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        return BigNumber.from(bytes);
    }
    private get current_interval(): BigNumber {
        return BigNumber.from(Math.floor(
            new Date().getTime() / this.interval
        ));
    }
    private hash(
        nonce: BigNumber, address: string, interval: BigNumber
    ): string {
        return keccak256(abi.encode([
            'uint256', 'address', 'uint256'
        ], [
            nonce, address, interval
        ]));
    }
    private amount(hash: string): BigNumber {
        return BigNumber.from(2 ** this.zeros(hash) - 1);
    }
    private zeros(hash: string): number {
        const match = hash.match(/^0x(?<zeros>0+)/);
        if (match && match.groups) {
            return match.groups.zeros.length;
        }
        return 0;
    }
    private get address() {
        return this._address;
    }
    private get frequency() {
        return this._frequency;
    }
    private set frequency(value: number) {
        this._frequency = value;
    }
    private get interval() {
        return this._interval;
    }
    private get mining_iid() {
        return this._mining_iid;
    }
    private set mining_iid(value: NodeJS.Timer | undefined) {
        this._mining_iid = value;
    }
    private get speed() {
        return this._speed;
    }
    private set speed(value: number) {
        this._speed = minmax(value, 0, 1);
    }
    private _address: string;
    private _frequency: number;
    private _interval: number;
    private _mining_iid: NodeJS.Timer | undefined;
    private _speed: number; // [0..1]
}
function minmax(
    value: number, min: number, max: number
) {
    return Math.min(max, Math.max(min, value));
}
export default Miner;
