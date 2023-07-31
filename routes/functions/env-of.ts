/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Request } from 'express';
import { color, nftLevels } from '../../source/params/parsers';
import { Nft, NftLevels, Page, Pager, Token } from '../../source/redux/types';
import { theme } from '../../source/theme';
import { Tokenizer } from '../../source/token';
import { capitalize } from './capitalize';

export const env_of = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  const token = Tokenizer.token(params.get('token'));
  const xtoken = Tokenizer.xify(token);
  const atoken = Tokenizer.aify(token);
  const token_lc = Tokenizer.lower(token);
  const xtoken_lc = Tokenizer.lower(xtoken);
  const atoken_lc = Tokenizer.lower(atoken);
  const power = token_lc.startsWith('a') ? 'APOWER' : 'XPOWER';
  const power_lc = power.toLowerCase();
  return {
    ...{
      POWER: power,
      power: power_lc,
      TOKEN: token,
      token: token_lc,
      Token: capitalize(token_lc, 2),
      xTOKEN: xtoken,
      xtoken: xtoken_lc,
      xToken: capitalize(xtoken_lc, 2),
      aTOKEN: atoken,
      atoken: atoken_lc,
      aToken: 'A' + capitalize(atoken_lc.slice(1)),
    }, ...{
      ...theme(color(params)),
      ...header_page(req),
      ...cover_image(req),
      ...otf_wallet(params),
      ...selector_token(params),
      ...nft_display(params),
      ...nft_chevron(params),
    }
  };
};
const header_page = (
  req: Request
) => {
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
const cover_image = (
  req: Request
) => {
  const page = Pager.parse(req.path);
  return {
    COVER_IMAGE:
      page === Page.Home ? 'cover-xpower' : 'cover-apower',
  };
};
const otf_wallet = (
  params: URLSearchParams
) => {
  const value = params.get('otf-wallet');
  let toggled = false;
  try {
    toggled = JSON.parse(value ?? 'false');
  } catch (ex) {
    toggled = false;
  }
  return {
    OTF_WALLET_TOGGLE: !toggled ? 'bi-wallet' : 'bi-wallet2',
    OTF_WALLET: !toggled ? 'd-none' : ''
  };
};
const selector_token = (
  params: URLSearchParams
) => {
  const token = Tokenizer.token(params.get('token'));
  return {
    SELECT0R_XPOW: token === Token.XPOW ? 'active' : '',
  };
};
const nft_display = (
  params: URLSearchParams
) => {
  const url_levels = nftLevels(params);
  const all_levels = Array.from(NftLevels({ min: 0, max: Infinity }));
  return Object.fromEntries(all_levels.map((l) => [
    `NFT_${Nft.nameOf(l)}_DISPLAY`, url_levels.includes(l) ? 'block' : 'none'
  ]));
};
const nft_chevron = (
  params: URLSearchParams
) => {
  const url_levels = nftLevels(params);
  const all_levels = Array.from(NftLevels({ min: 0, max: Infinity }));
  return Object.fromEntries(all_levels.map((l) => [
    `NFT_${Nft.nameOf(l)}_CHEVRON`, url_levels.includes(l) ? 'up' : 'down'
  ]));
};
export default env_of;
