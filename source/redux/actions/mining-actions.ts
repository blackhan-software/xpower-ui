import { Mining } from "../types/mining";

export type SetMining = {
    type: 'mining/set', payload: Partial<Mining>
};
export const setMining = (payload: Partial<Mining>): SetMining => ({
    type: 'mining/set', payload
});
export type Action = SetMining;
