/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Kind } from '../source/xpower';
import { theme } from '../source/theme';
import { Token } from '../source/token';
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
  const symbol = Token.symbol(token);
  const suffix = Token.suffix(token);
  res.render('nfts/nfts.pig', {
    TOKEN_SUFFIX: suffix.toUpperCase(),
    TOKEN: symbol.toUpperCase(),
    token_suffix: suffix.toLowerCase(),
    token: symbol.toLowerCase(),
    ...theme(symbol),
  });
});
/** GET nfts/migrate page. */
router.get('/migrate', (req, res) => {
  const params = new URLSearchParams(req.query as any);
  const token = params.get('token');
  const symbol = Token.symbol(token);
  const suffix = Token.suffix(token);
  res.render('nfts/nfts-migrate.pig', {
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
  const id_kind = Number(id.slice(-2));
  if (isNaN(id_kind)) {
    throw new Error(`${id} identifier ends w/non-number kind`);
  }
  const KIND = Kind[id_kind];
  if (!Kind[id_kind]) {
    throw new Error(`${id} identifier ends w/unknown kind`);
  }
  const location = env.XPOWER_NFT_REDIRECT[`${token}/${id}.json`];
  if (typeof location === 'string') {
    return res.redirect(location);
  }
  const TOKEN = token.toUpperCase();
  const kind = KIND.toLowerCase();
  res.send({
    name: `XPOW.${TOKEN} ${KIND}`,
    describe: `stakeable XPOW.${TOKEN} ${KIND} NFT bond`,
    image: `${host(req)}/images/nft/${id_year}/xpow.${token}-${kind}.png`
  });
});
export default router;
