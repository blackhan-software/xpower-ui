import { BigNumber } from 'ethers';
/**
 * @returns [start...end)
 */
export function* big_range(
    start: BigNumber | number,
    end?: BigNumber | number
) {
    if (typeof start === 'number') {
        start = BigNumber.from(start);
    }
    if (typeof end === 'number') {
        end = BigNumber.from(end);
    }
    if (typeof end === 'undefined') {
        end = start; start = BigNumber.from(0);
    }
    for (let i = start; i.lt(end); i = i.add(1)) {
        yield i;
    }
}
export default big_range;
