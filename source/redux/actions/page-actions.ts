import { createAction } from '@reduxjs/toolkit';
import { Page } from '../types';

export const switchPage = createAction(
    'page/switch', (page: Page) => ({ payload: { page } })
);
