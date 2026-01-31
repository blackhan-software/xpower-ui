/* eslint @typescript-eslint/no-explicit-any: [off] */
import { x40 } from '../../../source/functions';
import { account } from '../../../source/params/parsers';
import { Tokenizer } from '../../../source/token';
import { Request } from 'express';

export const env_of_wallet = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  return {
    ...aft_wallet(params),
    ...otf_wallet(params),
  };
};
const aft_wallet = (
  params: URLSearchParams
) => {
  const token = Tokenizer.token(params.get('token'));
  return {
    AFT_WALLET_ACCOUNT: x40(account(params) ?? 0n),
    AFT_WALLET_TOGGLE_ROTATE: Tokenizer.xified(token) ? '0deg' : '180deg'
  };
};
const otf_wallet = (
  params: URLSearchParams
) => {
  const value = params.get('otf-wallet');
  let toggled = false;
  try {
    toggled = JSON.parse(value ?? 'false');
  } catch (e) {
    console.debug(e);
    toggled = false;
  }
  return {
    OTF_WALLET_TOGGLE: !toggled ? 'bi-wallet' : 'bi-wallet2',
    OTF_WALLET: !toggled ? 'd-none' : ''
  };
};
export default env_of_wallet;
