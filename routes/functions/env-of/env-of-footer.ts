/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Page, Pager } from '../../../source/redux/types';
import { Request } from 'express';

export const env_of_footer = (req: Request): Record<string, string> => {
  return {
    ...footer_page(req),
  };
};
const footer_page = (
  req: Request
) => {
  const page = Pager.parse(req.path);
  return {
    FOOTER_SWAP:
      page === Page.Swap ? 'pt-extra' : '',
  };
};
export default env_of_footer;
