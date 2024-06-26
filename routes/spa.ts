import { env_of } from './functions';
import { Router } from 'express';
const router = Router();

import { readdir } from 'fs/promises';
import { join, sep } from 'path';

function routes(
  spa_env: Record<string, string>
) {
  /** GET mine page. */
  router.get('/mine', (req, res) => {
    res.render('mine/mine.pig', {
      DESCRIPTION: 'Mine & Mint Proof-of-Work XPower Tokens',
      TITLE: 'XPower: Mine', ...env_of(req), ...spa_env,
    });
  });
  /** GET nfts page. */
  router.get('/nfts', (req, res) => {
    res.render('nfts/nfts.pig', {
      DESCRIPTION: 'Mint stakeable XPower NFTs',
      TITLE: 'XPower: NFTs', ...env_of(req), ...spa_env
    });
  });
  /** GET ppts page. */
  router.get('/stake', (req, res) => {
    res.render('ppts/ppts.pig', {
      DESCRIPTION: 'Stake minted XPower NFTs',
      TITLE: 'XPower: Stake', ...env_of(req), ...spa_env
    });
  });
  /** GET swap page. */
  router.get('/swap', (req, res) => {
    res.render('swap/swap.pig', {
      DESCRIPTION: 'Swap XPower & APower Tokens',
      TITLE: 'XPower: Swap', ...env_of(req), ...spa_env
    });
  });
  /** GET about page. */
  router.get('/about', (req, res) => {
    res.render('about/about.pig', {
      DESCRIPTION: 'Mine & Mint Proof-of-Work XPower Tokens',
      TITLE: 'XPower: About', ...env_of(req), ...spa_env
    });
  });
}
worker(join('public', 'scripts'), 1).then((path) => {
  routes({ UI_WORKER_PATH: path });
});
async function worker(base_path: string, skip: number) {
  if (typeof process.env.UI_WORKER_PATH === 'string') {
    return process.env.UI_WORKER_PATH;
  }
  return await search(base_path, skip);
}
async function search(base_path: string, skip: number) {
  const tail = (full_path: string) => {
    return join(...full_path.split(sep).slice(skip));
  };
  const names = await readdir(base_path);
  for (const name of names) {
    const match = name.match(/worker\.([0-9a-f])+\.js$/i);
    if (match) return tail(join(base_path, name));
  }
  return tail(join(base_path, 'worker.js'));
}
export default router;
