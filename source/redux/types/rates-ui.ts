import { NftToken } from './nfts';

export type RatesUi = {
    refresher: Record<NftToken, Refresher>;
};
export type Refresher = {
    status: RefresherStatus | null;
}
export enum RefresherStatus {
    refreshing = 'refreshing',
    refreshed = 'refreshed',
    error = 'error',
}
export default RatesUi;