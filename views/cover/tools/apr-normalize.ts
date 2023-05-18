import { ROParams } from "../../../source/params";
import { Version } from "../../../source/types";

export function normalize(
    value: bigint | number
) {
    const denominator = ROParams.version < Version.v7b ? 1e3 : 1e6;
    if (typeof value === 'bigint') {
        return Number(value) / denominator;
    }
    return value / denominator;
}
export default normalize;
