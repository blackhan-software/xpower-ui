import { Year } from "../redux/types";

export const MAX_YEAR = ({ inclusive } = { inclusive: false }) => {
    return Number((inclusive ? 1 : 0) + new Date().getUTCFullYear());
}
export const MIN_YEAR = () => {
    return 2021;
}
export function* DeltaYears(
    min = MIN_YEAR(), max?: Year
) {
    if (typeof max !== 'number') {
        max = MAX_YEAR({ inclusive: true })
    }
    for (let dy = 0; dy < max - min; dy++) {
        yield dy;
    }
}
export function* Years({
    min, max, reverse
}: {
    min?: number, max?: number, reverse: boolean
} = {
    min: undefined, max: undefined, reverse: false
}) {
    if (typeof min !== 'number') {
        min = MIN_YEAR();
    }
    if (typeof max !== 'number') {
        max = MAX_YEAR({ inclusive: true })
    }
    if (reverse) {
        for (let y = max; y > min; y--) {
            yield y - 1;
        }
    } else {
        for (let y = min; y < max; y++) {
            yield y;
        }
    }
}
export default Years;
