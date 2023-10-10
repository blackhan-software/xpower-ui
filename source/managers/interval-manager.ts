import { EventEmitter } from 'events';

export type Started = {
    running: boolean
}
export type Stopped = {
    running: boolean
}
export type Tick = {
    current: number,
    previous: number
}
export class IntervalManager extends EventEmitter {
    private static DURATION_DEFAULT = 3_600_000; // 1 hour
    /**
     * @param duration interval duration (in milliseconds)
     */
    constructor({ start, duration }: { start: boolean, duration?: number }) {
        if (typeof duration === 'number') {
            if (duration < 0) {
                throw new Error('duration is negative');
            }
            if (duration === 0) {
                throw new Error('duration is zero');
            }
        }
        super();
        this._duration = duration ?? IntervalManager.DURATION_DEFAULT;
        if (start) this.start();
    }
    public get running(): boolean {
        return this.timer !== undefined;
    }
    public start(
        poll_ms = 1000
    ): void {
        if (this.running) {
            this.stop();
        }
        let previous: number;
        let current = this.interval;
        this.timer = setInterval(() => {
            previous = current;
            current = this.interval;
            if (current > previous) {
                this.emit('tick', {
                    current, previous
                });
            }
        }, poll_ms);
        this.emit('started', {
            running: this.running
        });
    }
    public stop(): void {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        this.emit('stopped', {
            running: this.running
        });
    }
    public get interval(): number {
        const time = new Date().getTime();
        return Math.floor(time / this.duration);
    }
    public static get interval(): number {
        const time = new Date().getTime();
        return Math.floor(time / this.duration);
    }
    public static intervalFrom(date: Date): number {
        return Math.floor(date.getTime() / this.duration);
    }
    private get duration() {
        return this._duration;
    }
    private static get duration() {
        return this.DURATION_DEFAULT;
    }
    private get timer() {
        return this._timer;
    }
    private set timer(value: NodeJS.Timeout | undefined) {
        this._timer = value;
    }
    private _duration: number;
    private _timer: NodeJS.Timeout | undefined;
}
export default IntervalManager;
