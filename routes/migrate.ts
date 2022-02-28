import { env_of } from './functions';
import express from 'express';
export const router = express.Router();

/** GET migration page. */
router.get('/', (req, res) => {
  res.render('migrate/index.pig', env_of(req));
});
export default router;
