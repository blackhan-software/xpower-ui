import { join } from 'path';
import { Nft, NftFullId, NftLevel, NftToken } from '../source/redux/types';
import { capitalize, host } from './functions';

import express from 'express';
const router = express.Router();

/** GET ppts/{token}/{id}.json metadata. */
router.get('/:token/:id.json', (req, res) => {
  const { token, id } = req.params;
  const { resolution } = req.query;
  const nft = {
    issue: Nft.issue(id as NftFullId),
    level: Nft.level(id as NftFullId),
    token: Nft.token(token as NftFullId)
  };
  const LEVEL = NftLevel[nft.level].toUpperCase();
  const order = 1 + nft.level / 3; // 1, 2, 3, ...
  const TOKEN = NftToken[nft.token].toUpperCase();
  const Token = capitalize(TOKEN.toLowerCase());
  res.send({
    name: `${LEVEL} ${TOKEN}`,
    description: `Staked ${LEVEL} ${TOKEN} NFT`,
    image: host(req) + join(
      '/ipfs/QmcMVdnJV6VaicjukafsTK1pX4Zthx6JbRvC9igLScrAjD/ppts',
      resolution as string ?? '320x427', `${nft.issue}`, Token,
      `${order}-${Token}_${LEVEL}.png`
    ),
  });
});
export default router;
