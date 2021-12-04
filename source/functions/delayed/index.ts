/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
import { delayed as _delayed } from "./delayed";
import { CancelableFunction } from "./delayed";
import { decorator as _decorator } from "./decorator";

export interface DelayedFunction {
    (fn: Function, ms?: number): CancelableFunction;
}
export interface DelayedFunction {
    decorator: Function;
}
export const delayed: DelayedFunction = (() => {
    (_delayed as any).decorator = _decorator;
    return _delayed as any;
})();
export default delayed;
