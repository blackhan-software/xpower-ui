import { env_of } from './functions';
import express from 'express';
const router = express.Router();

/** GET staking page. */
router.get('/', (req, res) => {
  res.render('staking/staking.pig', env_of(req));
});
export default router;
