/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Request } from 'express';
import { x40 } from '../../source/functions';
import { account, color, nftLevels } from '../../source/params/parsers';
import { Nft, NftLevels, Page, Pager } from '../../source/redux/types';
import { theme } from '../../source/theme';
import { Tokenizer } from '../../source/token';
import { DEX } from '../../source/types';
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
      ...cover_image(req),
      ...footer_page(req),
      ...header_page(req),
    }, ...{
      ...aft_wallet(params),
      ...dex_swap(params),
      ...nft_chevron(params),
      ...nft_display(params),
      ...otf_wallet(params),
      ...theme(color(params)),
    }
  };
};
const cover_image = (
  req: Request
) => {
  const page = Pager.parse(req.path);
  switch (page) {
    case Page.Home:
      return {
        COVER_IMAGE: '/images/all/cover-home.a4960415.jpg',
      };
    case Page.Nfts:
      return {
        COVER_IMAGE: '/images/all/cover-nfts.38c9c9b4.jpg',
      };
    case Page.Ppts:
      return {
        COVER_IMAGE: '/images/all/cover-ppts.e434794a.jpg',
      };
  }
  return {
    COVER_IMAGE: '',
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
const header_page = (
  req: Request
) => {
  const page = Pager.parse(req.path);
  return {
    HEADER_HOME:
      page === Page.Home ? 'active' : '',
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
const aft_wallet = (
  params: URLSearchParams
) => {
  return {
    AFT_WALLET_ACCOUNT: x40(account(params) ?? 0n)
  };
};
const dex_swap = (
  params: URLSearchParams
) => {
  const dex = params.get('dex');
  return {
    ACTIVE_PARASWAP: dex === DEX.paraswap || !dex
      ? 'active' : '',
    ACTIVE_UNISWAP: dex === DEX.uniswap
      ? 'active' : '',
    COLOR_PARASWAP: dex === DEX.paraswap || !dex
      ? 'var(--xp-dark)' : 'var(--xp-powered)',
    COLOR_UNISWAP: dex === DEX.uniswap
      ? 'var(--xp-dark)' : 'var(--xp-powered)',
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
export default env_of;
