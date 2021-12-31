/* eslint @typescript-eslint/no-explicit-any: [off] */
import express from 'express';
export const router = express.Router();
import createError from 'http-errors';
import { Tokenizer } from '../source/token';

/** CATCH 404 pages. */
router.use((req, res) => {
  const e = createError(404);
  // set locals (provide error in development)
  res.locals.status = e.status;
  res.locals.message = e.message;
  res.locals.error = req.app.get('env') === 'development' ? e : null;
  // set status as e.status
  res.status(e.status);
  // get current token (from request.query)
  const params = new URLSearchParams(req.query as any);
  const token = params.get('token');
  const symbol = Tokenizer.symbol(token);
  const suffix = Tokenizer.suffix(token);
  res.render('error/error.pig', {
    TOKEN_SUFFIX: suffix.toUpperCase(),
    TOKEN: symbol.toUpperCase(),
    token_suffix: suffix.toLowerCase(),
    token: symbol.toLowerCase(),
  });
});
export default router;
