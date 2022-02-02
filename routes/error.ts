import createError from 'http-errors';
import { env_of } from './functions';
import express from 'express';
const router = express.Router();

/** CATCH 404 pages. */
router.use((req, res) => {
  const e = createError(404);
  res.locals.status = e.status;
  res.locals.message = e.message;
  res.locals.error = req.app.get('env') === 'development' ? e : null;
  res.status(e.status);
  res.render('error/error.pig', env_of(req));
});
export default router;
