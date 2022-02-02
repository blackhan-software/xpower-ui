import { env_of } from './functions';
import express from 'express';
const router = express.Router();

/** GET about page. */
router.get('/', (req, res) => {
  res.render('about/about.pig', env_of(req));
});
export default router;
