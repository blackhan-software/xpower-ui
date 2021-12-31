/* eslint @typescript-eslint/no-explicit-any: [off] */
import { theme } from '../source/theme';
import { Tokenizer } from '../source/token';

import express from 'express';
export const router = express.Router();

/** REDIRECT to home page. */
router.get('/', (req, res) => {
  res.redirect('/home');
});
/** GET home page. */
router.get('/home', (req, res) => {
  const params = new URLSearchParams(req.query as any);
  const token = params.get('token');
  const symbol = Tokenizer.symbol(token);
  const suffix = Tokenizer.suffix(token);
  const levels: { [key: string]: string } = {};
  for (let i = 1; i <= 64; i++) {
    levels[`LEVEL_${i}`] = `${Tokenizer.amount(token, i)}`;
  }
  res.render('home/home.pig', {
    TOKEN_SUFFIX: suffix.toUpperCase(),
    TOKEN: symbol.toUpperCase(),
    token_suffix: suffix.toLowerCase(),
    token: symbol.toLowerCase(),
    ...theme(symbol),
    ...levels
  });
});
export default router;
