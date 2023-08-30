export type RatesUi = {
    refresher: Refresher;
};
export type Refresher = {
    status: RefresherStatus | null;
}
export enum RefresherStatus {
    refreshing = 'refreshing',
    refreshed = 'refreshed',
    refetch = 'refetch',
    error = 'error',
}
export default RatesUi;
