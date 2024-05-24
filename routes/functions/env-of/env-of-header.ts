/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Page, Pager } from '../../../source/redux/types';
import { Request } from 'express';

export const env_of_header = (req: Request): Record<string, string> => {
  return {
    ...header_page(req),
  };
};
const header_page = (
  req: Request
) => {
  const page = Pager.parse(req.path);
  return {
    HEADER_HOME:
      page === Page.Home ? 'active' : '',
    HEADER_MINE:
      page === Page.Mine ? 'active' : '',
    HEADER_NFTS:
      page === Page.Nfts ? 'active' : '',
    HEADER_PPTS:
      page === Page.Ppts ? 'active' : '',
    HEADER_SWAP:
      page === Page.Swap ? 'active' : '',
    HEADER_ABOUT:
      page === Page.About ? 'active' : '',
  };
};
export default env_of_header;
