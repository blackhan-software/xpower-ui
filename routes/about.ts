/* eslint @typescript-eslint/no-explicit-any: [off] */
import { theme } from '../source/theme';
import { Tokenizer } from '../source/token';

import express from 'express';
export const router = express.Router();

/** GET about page. */
router.get('/', (req, res) => {
  const params = new URLSearchParams(req.query as any);
  const token = params.get('token');
  const symbol = Tokenizer.symbol(token);
  const suffix = Tokenizer.suffix(token);
  res.render('about/about.pig', {
    TOKEN_SUFFIX: suffix.toUpperCase(),
    TOKEN: symbol.toUpperCase(),
    token_suffix: suffix.toLowerCase(),
    token: symbol.toLowerCase(),
    ...theme(symbol),
  });
});
export default router;
