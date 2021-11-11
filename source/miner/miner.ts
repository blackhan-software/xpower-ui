import { defaultAbiCoder as abi } from 'ethers/lib/utils';
import { keccak256 } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { EventEmitter } from 'events';
import { IntervalManager } from '../managers';
import { TokenSymbol } from '../token';

export type OnMined = (
    nonce: BigNumber, amount: BigNumber
) => void;
export class Miner extends EventEmitter {
    private static SPEED_DEFAULT = 0.5; // [0..1]
    private static FREQUENCY_DEFAULT = 10; // per ms
    public constructor(
        /** xpow-token to mine for */
        token: TokenSymbol,
        /** address to mine for */
        address: string,
        /** initial speed of mining (in [0..1]) */
        speed = Miner.SPEED_DEFAULT,
        /** initial loops per millisecond (in [0..]) */
        frequency = Miner.FREQUENCY_DEFAULT,
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
        this._token = token;
        this._address = address;
        this._speed = speed;
        this._frequency = frequency;
    }
    public get running(): boolean {
        return this.mining_iid !== undefined;
    }
    public start(block_hash: string, callback: OnMined): void {
        if (this.running) {
            return;
        }
        this.mining_iid = setInterval(async () => {
            this.frequency = this.mine(
                this.frequency, block_hash, callback
            );
        });
        this.emit('started', {
            running: this.running
        });
        this._started += 1;
    }
    public get started(): number {
        return this._started;
    }
    public stop(): void {
        if (this.running === false) {
            return;
        }
        if (this.mining_iid !== undefined) {
            clearInterval(this.mining_iid);
            this.mining_iid = undefined;
        }
        this.emit('stopped', {
            running: this.running
        });
        this.frequency = Miner.FREQUENCY_DEFAULT;
        this._stopped += 1;
    }
    public get stopped(): number {
        return this._stopped;
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
    private mine(
        frequency: number, block_hash: string, callback: OnMined
    ) {
        for (let i = 0; i < Math.ceil(frequency * this.speed); i++) {
            const { nonce, amount, ms } = this.work_timed(block_hash);
            const new_frequency = ms > 0.0 ? 1 / ms : 0;
            frequency = (2 * frequency + new_frequency) / 3;
            frequency = Math.ceil(frequency); // >= 1.0
            callback(nonce, amount);
        }
        return frequency;
    }
    private work_timed(block_hash: string) {
        const start = performance.now();
        const { nonce, amount } = this.work(block_hash);
        const ended = performance.now();
        return {
            nonce, amount, ms: ended - start
        };
    }
    private work(block_hash: string) {
        const [nonce, address, interval] = [
            this.next_nonce, this.address, this.current_interval
        ];
        const amount = this.amount(this.hash(
            nonce, address, interval, block_hash
        ));
        return { nonce, amount };
    }
    private get next_nonce(): BigNumber {
        if (this._nonce === undefined) {
            const bytes = new Uint8Array(32);
            crypto.getRandomValues(bytes);
            this._nonce = BigNumber.from(bytes);
        } else {
            this._nonce = this._nonce.add(1);
        }
        return this._nonce;
    }
    private get current_interval(): number {
        return this.interval_manager.interval;
    }
    private hash(
        nonce: BigNumber, address: string,
        interval: number, block_hash: string
    ): string {
        return keccak256(abi.encode([
            'string', 'uint256', 'address', 'uint256', 'bytes32'
        ], [
            this.token, nonce, address, interval, block_hash
        ]));
    }
    private amount(hash: string): BigNumber {
        let amount: BigNumber;
        switch(this.token) {
            case TokenSymbol.ASIC:
                amount = BigNumber.from(16 ** this.zeros(hash) - 1);
                break;
            case TokenSymbol.GPU:
                amount = BigNumber.from(2 ** this.zeros(hash) - 1);
                break;
            case TokenSymbol.CPU:
                amount = BigNumber.from(this.zeros(hash));
                break;
            default:
                amount = BigNumber.from(0);
                break;
        }
        return amount;
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
    private get interval_manager() {
        if (this._interval_manager === undefined) {
            this._interval_manager = new IntervalManager({
                start: false
            });
        }
        return this._interval_manager;
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
    private get token(): TokenSymbol {
        return this._token;
    }
    private _address: string;
    private _frequency: number;
    private _interval_manager: IntervalManager | undefined;
    private _mining_iid: NodeJS.Timer | undefined;
    private _nonce: BigNumber | undefined;
    private _speed: number; // [0..1]
    private _started = 0;
    private _stopped = 0;
    private _token: TokenSymbol;
}
function minmax(
    value: number, min: number, max: number
) {
    return Math.min(max, Math.max(min, value));
}
export default Miner;
