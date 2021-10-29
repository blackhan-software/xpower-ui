import { BigNumber  } from 'ethers';
/**
 * @returns true if n in [min...max)
 */
export function in_range(
    n: BigNumber, { min, max }: {
        /** lower bound of range (inclusive) */
        min: number,
        /** upper bound of range (exclusive) */
        max: number
    }
): boolean {
    if (min < Infinity && n.lt(min) || min === Infinity) {
        return false;
    }
    if (max < Infinity && n.gte(max)) {
        return false;
    }
    return true;
}
export default in_range;
