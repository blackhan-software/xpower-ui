import { Request } from 'express';

import env_of_cover from './env-of-cover';
import env_of_footer from './env-of-footer';
import env_of_header from './env-of-header';
import env_of_home from './env-of-home';
import env_of_mine from './env-of-mine';
import env_of_nfts from './env-of-nfts';
import env_of_swap from './env-of-swap';
import env_of_theme from './env-of-theme';
import env_of_token from './env-of-token';
import env_of_wallet from './env-of-wallet';

export const env_of = (req: Request): Record<string, string> => {
  return {
    ...env_of_cover(req),
    ...env_of_footer(req),
    ...env_of_header(req),
    ...env_of_home(req),
    ...env_of_mine(req),
    ...env_of_nfts(req),
    ...env_of_swap(req),
    ...env_of_theme(req),
    ...env_of_token(req),
    ...env_of_wallet(req),
  };
};
export default env_of;
