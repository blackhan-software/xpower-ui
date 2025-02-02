/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Request } from 'express';

export const env_of_cover = (req: Request): Record<string, string> => {
  return {
    ...desktop_images(req),
  };
};
const desktop_images = (
  _req: Request
) => {
  const DESKTOP_MINE = '/images/all/desktop-mine.583bab6c.jpg';
  const DESKTOP_NFTS = '/images/all/desktop-nfts.2d2fb0e7.jpg';
  const DESKTOP_PPTS = '/images/all/desktop-ppts.d1b1a5cc.jpg';
  const DESKTOP_SWAP = '/images/all/desktop-swap.7a58ff33.jpg';
  return {
    DESKTOP_MINE,
    DESKTOP_NFTS,
    DESKTOP_PPTS,
    DESKTOP_SWAP,
  };
};
export default env_of_cover;
