export const MAX_YEAR = () => {
    return 1 + new Date().getUTCFullYear();
}
export const MIN_YEAR = () => {
    return 2021;
}
export function* DeltaYears(
    min = MIN_YEAR(), max?: number
) {
    if (typeof max !== 'number') {
        max = MAX_YEAR()
    }
    for (let dy = 0; dy < max - min; dy++) {
        yield dy;
    }
}
export function* Years(
    min = MIN_YEAR(), max?: number
) {
    if (typeof max !== 'number') {
        max = MAX_YEAR()
    }
    for (let y = min; y < max ; y++) {
        yield y;
    }
}
export default Years;
