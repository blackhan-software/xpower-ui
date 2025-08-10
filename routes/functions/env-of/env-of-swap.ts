/* eslint @typescript-eslint/no-explicit-any: [off] */
import { DEX } from '../../../source/types';
import { Request } from 'express';

export const env_of_dex = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  return {
    ...dex_swap(params),
  };
};
const dex_swap = (
  params: URLSearchParams
) => {
  const dex = params.get('dex');
  return {
    ACTIVE_VELORA: dex === DEX.velora || !dex
      ? 'active' : '',
    ACTIVE_UNISWAP: dex === DEX.uniswap
      ? 'active' : '',
    COLOR_VELORA: dex === DEX.velora || !dex
      ? 'var(--xp-dark)' : 'var(--xp-powered)',
    COLOR_UNISWAP: dex === DEX.uniswap
      ? 'var(--xp-dark)' : 'var(--xp-powered)',
  };
};
export default env_of_dex;
