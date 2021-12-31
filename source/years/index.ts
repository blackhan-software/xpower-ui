export const MAX_YEAR = ({ inclusive } = { inclusive: false }) => {
    return (inclusive ? 1 : 0) + new Date().getUTCFullYear();
}
export const MIN_YEAR = () => {
    return 2021;
}
export function* DeltaYears(
    min = MIN_YEAR(), max?: number
) {
    if (typeof max !== 'number') {
        max = MAX_YEAR({ inclusive: true })
    }
    for (let dy = 0; dy < max - min; dy++) {
        yield dy;
    }
}
export function* Years(
    min = MIN_YEAR(), max?: number
) {
    if (typeof max !== 'number') {
        max = MAX_YEAR({ inclusive: true })
    }
    for (let y = min; y < max; y++) {
        yield y;
    }
}
export default Years;
