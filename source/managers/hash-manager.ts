/* eslint @typescript-eslint/no-explicit-any: [off] */
import { EventEmitter } from 'events';

export type Slot = {
    slot: string;
}
export class HashManager extends EventEmitter {
    public get(hash: string, slot: Slot): number | null {
        const time = localStorage.getItem(
            `block-hash[${key(hash, slot)}]`
        );
        if (typeof time === 'string') {
            return parseInt(time);
        }
        return time;
    }
    public static get(hash: string, slot: Slot): number | null {
        return this.me.get(hash, slot);
    }
    public set(hash: string, time: number, slot: Slot): void {
        const latest_time = this.latestTime(slot);
        if (latest_time === null || latest_time < time) {
            localStorage.setItem(`latest[${key('time', slot)}]`, `${time}`);
            localStorage.setItem(`latest[${key('hash', slot)}]`, hash);
        }
        const current_time = this.get(hash, slot);
        if (current_time === null || current_time < time) {
            localStorage.setItem(`block-hash[${key(hash, slot)}]`, `${time}`);
            this.emit('block-hash', { block_hash: hash, slot: slot.slot });
        }
    }
    public static set(hash: string, time: number, slot: Slot): void {
        this.me.set(hash, time, slot);
    }
    public latestHash(slot: Slot): string | null {
        return localStorage.getItem(`latest[${key('hash', slot)}]`);
    }
    public static latestHash(slot: Slot): string | null {
        return this.me.latestHash(slot);
    }
    public latestTime(slot: Slot): number | null {
        const item = localStorage.getItem(`latest[${key('time', slot)}]`);
        return typeof item === 'string' ? parseInt(item) : item;
    }
    public static latestTime(slot: Slot): number | null {
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
function key(hash: string, { slot }: Slot) {
    return `${hash}:${slot}`;
}
export default HashManager;
