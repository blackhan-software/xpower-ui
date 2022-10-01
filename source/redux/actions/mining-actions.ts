import { DeepPartial } from 'redux';
import { Mining } from '../types/mining';

export type SetMiningSpeed = {
    type: 'mining/set-speed',
    payload: Pick<Mining, 'speed'>
};
export const setMiningSpeed = (
    payload: Pick<Mining, 'speed'>
): SetMiningSpeed => ({
    type: 'mining/set-speed', payload
});
export type SetMiningStatus = {
    type: 'mining/set-status',
    payload: Pick<Mining, 'status'>
};
export const setMiningStatus = (
    payload: Pick<Mining, 'status'>
): SetMiningStatus => ({
    type: 'mining/set-status', payload
});
export type SetMining = {
    type: 'mining/set',
    payload: DeepPartial<Mining>
};
export const setMining = (
    payload: DeepPartial<Mining>
): SetMining => ({
    type: 'mining/set', payload
});
export type Action =
    SetMiningSpeed | SetMiningStatus | SetMining;
