import { createAction } from '@reduxjs/toolkit';
import { DeepPartial, Mining } from '../types';

export const setMiningSpeed = createAction(
    'mining/set-speed', ({ speed }: Pick<Mining, 'speed'>) => ({
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
