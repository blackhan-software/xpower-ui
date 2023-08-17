/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Timestamp, Token } from '../redux/types';
import { Tokenizer } from '../token';
import { Version } from '../types';

import { EventEmitter } from 'events';

export type Hash = bigint;
export type Slot = {
    token: Token, version: Version
}
export class HashManager extends EventEmitter {
    public get(hash: Hash, slot: Slot): Timestamp | null {
        const time = localStorage.getItem(
            `block-hash[${key(hash, slot)}]`
        );
        if (typeof time === 'string') {
            return BigInt(time);
        }
        return time;
    }
    public static get(hash: Hash, slot: Slot): Timestamp | null {
        return this.me.get(hash, slot);
    }
    public set(hash: Hash, time: Timestamp, slot: Slot): void {
        const latest_time = this.latestTime(slot);
        if (latest_time === null || latest_time <= time) {
            localStorage.setItem(`latest[${key('time', slot)}]`, `${time}`);
            localStorage.setItem(`latest[${key('hash', slot)}]`, `${hash}`);
        }
        const current_time = this.get(hash, slot);
        if (current_time === null || current_time <= time) {
            localStorage.setItem(`block-hash[${key(hash, slot)}]`, `${time}`);
            this.emit('block-hash', { block_hash: BigInt(hash), slot });
        }
    }
    public static set(hash: Hash, time: Timestamp, slot: Slot): void {
        this.me.set(hash, time, slot);
    }
    public latestHash(slot: Slot): Hash | null {
        const item = localStorage.getItem(`latest[${key('hash', slot)}]`);
        return item !== null ? BigInt(item) : null;
    }
    public static latestHash(slot: Slot): Hash | null {
        return this.me.latestHash(slot);
    }
    public latestTime(slot: Slot): Timestamp | null {
        const item = localStorage.getItem(`latest[${key('time', slot)}]`);
        return typeof item === 'string' ? BigInt(item) : item;
    }
    public static latestTime(slot: Slot): Timestamp | null {
        return this.me.latestTime(slot);
    }
    public static get me(): HashManager {
        if (this._me === undefined) {
            this._me = new HashManager();
        }
        return this._me;
    }
    private static _me: HashManager | undefined;
}
function key(hash: Hash | string, { token, version }: Slot) {
    return `${hash}:${Tokenizer.xify(token)}:${version}`;
}
export default HashManager;
