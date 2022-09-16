/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Page, Pager, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { theme } from '../../source/theme';
import { capitalize } from './capitalize';
import { Request } from 'express';

export const env_of = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  const token = Tokenizer.token(params.get('token'));
  const token_lc = Tokenizer.lower(token);
  return {
    ...{
      TOKEN: token,
      token: token_lc,
      Token: capitalize(token_lc),
    },
    ...{
      ...theme(token),
      ...header_page(req),
      ...otf_wallet(req),
      ...selector_token(req)
    }
  };
};
const header_page = (req: Request) => {
  const page = Pager.parse(req.path);
  return {
    HEADER_HOME:
      page === Page.Home ? 'active' : '',
    HEADER_NFTS:
      page === Page.Nfts ? 'active' : '',
    HEADER_STAKING:
      page === Page.Ppts ? 'active' : '',
    HEADER_ABOUT:
      page === Page.About ? 'active' : '',
  };
};
const otf_wallet = (req: Request) => {
  const params = new URLSearchParams(req.query as any);
  const value = params.get('otf-wallet');
  let toggled = false;
  try {
    toggled = JSON.parse(value ?? 'false');
  } catch (ex) {
    toggled = false;
  }
  return {
    OTF_WALLET: !toggled ? 'd-none' : ''
  };
};
const selector_token = (req: Request) => {
  const params = new URLSearchParams(req.query as any);
  const token = Tokenizer.token(params.get('token'));
  return {
      SELECT0R_THOR: token === Token.THOR ? 'active' : '',
      SELECT0R_LOKI: token === Token.LOKI ? 'active' : '',
      SELECT0R_ODIN: token === Token.ODIN ? 'active' : '',
      SELECT0R_HELA: token === Token.HELA ? 'active' : ''
  };
};
export default env_of;
