export * from './aft-wallet';
export * from './base';
export * from './history';
export * from './mining';
export * from './minting';
export * from './nfts';
export * from './nfts-ui';
export * from './nonces';
export * from './otf-wallet';
export * from './page';
export * from './ppts-ui';
export * from './rates';
export * from './rates-ui';
export * from './refresh';
export * from './token';
export * from './wallet';
export * from './ui';

export function Empty<T extends {
    items: Record<string | number | symbol, unknown>
}>() {
    return { items: {} } as T;
}
export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
