export enum DEX {
    velora = 'velora',
    uniswap = 'uniswap',
}
export function DEXs(): Set<DEX> {
    const ref = DEX as typeof DEX & {
        _set?: Set<DEX>
    };
    if (ref._set === undefined) {
        ref._set = new Set(Object.values(DEX));
    }
    return ref._set;
}
export function DEXAt(index: number): DEX {
    const dexes = Array.from(DEXs());
    if (index < 0) {
        index += dexes.length;
    }
    return dexes[index];
}
export default DEX;
