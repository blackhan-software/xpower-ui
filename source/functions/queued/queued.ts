/* eslint @typescript-eslint/explicit-module-boundary-types: [off] */
/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/no-unsafe-function-type: [off] */
/* eslint prefer-spread: [off] */
import { random } from '../random';
declare type Promisor<T = any> = (...args: any[]) => Promise<T>;
/**
 * QueueError class
 */
export class QueueError extends Error {}
/**
 * The Queue returns a queue *per* (optional) class name and (optional) function
 * name i.e. two or more different functions with the **same** (class plus) name
 * will be part of the **same** queue!
 */
export class Queue<T> {
    public constructor(options?: {
        /** flag to auto dequeue */
        auto?: boolean,
        /** function name (if any) */
        name?: string,
        /** maximum queue size */
        size?: number,
        /** synchronized dequeueing */
        sync?: boolean,
        /** lock acquisition and release */
        lock?: {
            acquire: () => Promise<boolean>,
            release: () => Promise<boolean>
        }
    }) {
        if (options === undefined) {
            options = {};
        }
        this._auto = options.auto ?? true;
        this._name = options.name ?? '';
        this._size = options.size;
        this._sync = options.sync ?? true;
        this._lock = options.lock ?? {
            acquire: () => Promise.resolve(true),
            release: () => Promise.resolve(true)
        }
    }
    public enqueue(callback: Promisor<T>, options: {
        name?: string // class name (if any)
    }) {
        if (this._queue === undefined) {
            const name = options.name && this._name
                ? `${options.name}.${this._name}` : this._name
                ? `${this._name}` : random(8);
            if (Queue._q[name] === undefined) {
                Queue._q[name] = [];
            }
            this._queue = Queue._q[name];
        }
        if (typeof this._size === 'number' &&
            this._queue.length >= this._size - 1
        ) {
            throw new QueueError('full');
        }
        return new Promise<T>((resolve) => {
            this._queue?.push(async () => {
                const result = await callback();
                if (result) {
                    if (this._sync) {
                        await this.dequeue();
                    } else {
                        this.dequeue();
                    }
                }
                return result;
            });
            if (this._auto && !this._running) {
                this.dequeue().then((result) => {
                    if (result) resolve(result);
                });
            }
        });
    }
    public async dequeue(): Promise<T | undefined> {
        const head = this._queue?.shift();
        if (head) {
            this._running = true;
        } else {
            this._running = false;
        }
        if (head) {
            if (await this._lock.acquire()) {
                const result = await head();
                await this._lock.release();
                return result;
            }
            this._running = false;
            throw new QueueError('busy');
        }
    }
    private _auto = false;
    private _name = '';
    private _running = false;
    private _size?: number;
    private _sync = true;
    private _lock: {
        acquire: () => Promise<boolean>,
        release: () => Promise<boolean>
    }
    private _queue?: Promisor<T>[];
    private static _q: {
        [key: string]: Promisor[]
    } = {};
}
/**
 * Wrap the provided function into a queue where the queue is determined by the
 * name of the function (`fn.name`); dequeueing starts based on the given flag,
 * i.e. whether the latter has value of `true` or `false` -- on each invocation
 * of the wrapped function.
 *
 * @param fn
 *  function to enqueue
 * @param options
 *  dequeueing options
 * @returns
 *  a queue of functions
 */
 export const auto = <T>(flag: boolean) => (
    fn: Function, options?: {
        /** maximum queue size */
        size?: number,
        /** synchronized dequeueing */
        sync?: boolean,
        /** lock acquisition and release */
        lock?: {
            acquire: () => Promise<boolean>,
            release: () => Promise<boolean>
        }
    }
) => {
    const queue = new Queue<T>({
        auto: flag, name: fn.name, ...options
    });
    const queuer = function (
        this: any, ...args: any[]
    ) {
        const wrapped = () => new Promise<T>((resolve) => {
            const result = fn.apply(
                this, args.concat([(arg_result: T) => {
                    if (arg_result) {
                        resolve(arg_result);
                    }
                    queue.dequeue();
                }])
            );
            if (result) {
                resolve(result);
            }
        });
        return queue.enqueue(wrapped, {
            name: this?.constructor?.name
        });
    };
    queuer.next = () => {
        return queue.dequeue();
    };
    return queuer;
};
/**
 * Wrap the provided function into a queue where the queue is determined by the
 * name of the function (`fn.name`); dequeueing starts automatically -- on each
 * invocation of the wrapped function.
 *
 * @param fn
 *  function to enqueue
 * @param options
 *  dequeueing options
 * @returns
 *  a queue of functions
 */
export const queued = <T>(
    fn: Function, options?: {
        /** maximum queue size */
        size?: number,
        /** synchronized dequeueing */
        sync?: boolean,
        /** lock acquisition and release */
        lock?: {
            acquire: () => Promise<boolean>,
            release: () => Promise<boolean>
        }
    }
) => {
    return auto<T>(true)(fn, options);
};
queued.auto = auto;
export default queued;
