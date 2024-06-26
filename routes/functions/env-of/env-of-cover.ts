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
        COVER_IMAGE: '/images/all/cover-mine.a4960415.jpg',
      };
    case Page.Nfts:
      return {
        COVER_IMAGE: '/images/all/cover-nfts.95716b50.jpg',
      };
    case Page.Ppts:
      return {
        COVER_IMAGE: '/images/all/cover-ppts.215d5ae0.jpg',
      };
  }
  return {
    COVER_IMAGE: '',
  };
};
export default env_of_cover;
