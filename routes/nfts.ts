/* eslint @typescript-eslint/no-explicit-any: [off] */
import { NftLevel } from '../source/redux/types';
import { theme } from '../source/theme';
import { Tokenizer } from '../source/token';
import { host } from './functions';

import env from '../env';
import express from 'express';
export const router = express.Router();

const TOKENS = new Set([
  'cpu', 'gpu', 'asic'
]);

/** GET nfts page. */
router.get('/', (req, res) => {
  const params = new URLSearchParams(req.query as any);
  const token = params.get('token');
  const symbol = Tokenizer.symbol(token);
  const suffix = Tokenizer.suffix(token);
  res.render('nfts/nfts.pig', {
    TOKEN_SUFFIX: suffix.toUpperCase(),
    TOKEN: symbol.toUpperCase(),
    token_suffix: suffix.toLowerCase(),
    token: symbol.toLowerCase(),
    ...theme(symbol),
  });
});
/** GET nfts/.migrate page. */
router.get('/.migrate', (req, res) => {
  const params = new URLSearchParams(req.query as any);
  const token = params.get('token');
  const symbol = Tokenizer.symbol(token);
  const suffix = Tokenizer.suffix(token);
  res.render('nfts/migrate/migrate.pig', {
    TOKEN_SUFFIX: suffix.toUpperCase(),
    TOKEN: symbol.toUpperCase(),
    token_suffix: suffix.toLowerCase(),
    token: symbol.toLowerCase(),
    ...theme(symbol),
  });
});
/** GET nfts/{token}/{id}.json metadata. */
router.get('/:token/:id.json', (req, res) => {
  const { token, id } = req.params;
  if (!TOKENS.has(token)) {
    throw new Error(`${token} token is unknown`);
  }
  const id_year = Number(id.slice(0, -2));
  if (isNaN(id_year)) {
    throw new Error(`${id} identifier starts w/non-number year`);
  }
  const id_level = Number(id.slice(-2));
  if (isNaN(id_level)) {
    throw new Error(`${id} identifier ends w/non-number level`);
  }
  const LEVEL = NftLevel[id_level];
  if (!NftLevel[id_level]) {
    throw new Error(`${id} identifier ends w/unknown level`);
  }
  const location = env.XPOWER_NFT_REDIRECT[`${token}/${id}.json`];
  if (typeof location === 'string') {
    return res.redirect(location);
  }
  const TOKEN = token.toUpperCase();
  const level = LEVEL.toLowerCase();
  res.send({
    name: `XPOW.${TOKEN} ${LEVEL}`,
    describe: `stakeable XPOW.${TOKEN} ${LEVEL} NFT bond`,
    image: `${host(req)}/images/nft/${id_year}/xpow.${token}-${level}.png`
  });
});
export default router;
