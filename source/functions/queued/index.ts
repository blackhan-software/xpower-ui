/* eslint @typescript-eslint/no-explicit-any: [off] */
import { decorator as _decorator } from './decorator';
import { queued as _queued } from './queued';
export { QueueError } from './queued';

declare type TDecorator = typeof _decorator;
declare type TQueued = typeof _queued;
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
 export const queued = (() => {
    (_queued as any).decorator = _decorator;
    return _queued as TQueued & {
        decorator: TDecorator
    };
})();
export default queued;
