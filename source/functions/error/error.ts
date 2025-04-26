/* eslint @typescript-eslint/no-explicit-any: [off] */
import { ErrorDescription } from "ethers";

/**
 * @returns normalized exception
 */
export function error(e: ErrorDescription | Error | any): Error {
    console.error(e);
    if (e instanceof Error) {
        return e;
    }
    if (e.error) {
        e = e.error;
    }
    if (e.message) {
        return new Error(e.message);
    }
    return fromErrorDescription(e);
}
export function fromErrorDescription(e: ErrorDescription): Error {
    const parts = e.fragment.inputs.map((input, i) => {
        return `${input.name}=${formatArg(e.args[i])}`;
    });
    return new Error(`Error: ${e.name}(${parts.join(", ")})`);
}
function formatArg(arg: any): string {
    if (typeof arg === 'bigint') {
        return arg.toString();
    }
    if (typeof arg === 'object') {
        return JSON.stringify(arg);
    }
    return String(arg);
}
export default error;
