import { Router } from 'express';
import { env_of } from './functions';
const router = Router();

/** REDIRECT to manifest.json. */
router.get(/\/[^/]+\/manifest\.json$/, (req, res) => {
  res.redirect('/manifest.json');
});
/** REDIRECT to home page. */
router.get('/', (req, res) => {
  res.redirect('/home');
});
/** GET home page. */
router.get('/home', (req, res) => {
  res.render('home/home.pig', {
    DESCRIPTION: 'Mine & Mint Proof-of-Work XPower Tokens',
    TITLE: 'XPower', ...env_of(req),
  });
});
export default router;
