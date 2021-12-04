/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
import { buffered as _buffered } from './buffered';
import { CancelableFunction } from './buffered';
import { decorator as _decorator } from './decorator';

export interface BufferedFunction {
    (fn: Function, ms?: number): CancelableFunction;
}
export interface BufferedFunction {
    decorator: Function;
}
export const buffered: BufferedFunction = (() => {
    (_buffered as any).decorator = _decorator;
    return _buffered as any;
})();
export default buffered;
