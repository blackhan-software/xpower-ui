/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Page, Pager } from '../../../source/redux/types';
import { Request } from 'express';

export const env_of_cover = (req: Request): Record<string, string> => {
  return {
    ...cover_image(req),
  };
};
const cover_image = (
  req: Request
) => {
  const page = Pager.parse(req.path);
  switch (page) {
    case Page.Mine:
      return {
        COVER_IMAGE: '/images/all/cover-mine.a0ef911a.jpg',
      };
    case Page.Nfts:
      return {
        COVER_IMAGE: '/images/all/cover-nfts.9aed440f.jpg',
      };
    case Page.Ppts:
      return {
        COVER_IMAGE: '/images/all/cover-ppts.dfd1f996.jpg',
      };
    case Page.Swap:
      return {
        COVER_IMAGE: '/images/all/cover-swap.8091b97e.jpg',
      };
  }
  return {
    COVER_IMAGE: '',
  };
};
export default env_of_cover;
