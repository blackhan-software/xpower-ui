import { createAction, DeepPartial } from '@reduxjs/toolkit';
import { Mining } from '../types/mining';

export const setMiningSpeed = createAction(
    'mining/set-speed', ({ speed }: DeepPartial<Pick<Mining, 'speed'>>) => ({
        payload: { speed }
    })
);
export const setMiningStatus = createAction(
    'mining/set-status', ({ status }: Pick<Mining, 'status'>) => ({
        payload: { status }
    })
);
export const setMining = createAction(
    'mining/set', (mining: DeepPartial<Mining>) => ({
        payload: mining
    })
);
