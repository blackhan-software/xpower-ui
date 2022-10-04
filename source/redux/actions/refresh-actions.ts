import { createAction } from '@reduxjs/toolkit';

export const refresh = createAction(
    'refresh', () => ({ payload: { date: new Date().toISOString() } })
);
