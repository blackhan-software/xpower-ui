/* eslint @typescript-eslint/no-explicit-any: [off] */
import { theme } from '../source/theme';
import { Token } from '../source/token';

import express from 'express';
export const router = express.Router();

/** GET migration page. */
router.get('/', (req, res) => {
  const params = new URLSearchParams(req.query as any);
  const token = params.get('token');
  const symbol = Token.symbol(token);
  const suffix = Token.suffix(token);
  res.render('migrate/migrate.pig', {
    TOKEN_SUFFIX: suffix.toUpperCase(),
    TOKEN: symbol.toUpperCase(),
    token_suffix: suffix.toLowerCase(),
    token: symbol.toLowerCase(),
    ...theme(symbol),
  });
});
export default router;
