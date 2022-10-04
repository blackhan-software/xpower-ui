import { createAction } from '@reduxjs/toolkit';
import { Token } from '../types';

export const switchToken = createAction(
    'token/switch', (token: Token) => ({ payload: { token } })
);
