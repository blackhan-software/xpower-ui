import { Nft, NftFullId, NftLevel, Token } from '../source/redux/types';
import { capitalize, host } from './functions';

import { Router } from 'express';
import { join } from 'path';
const router = Router();

/** GET nfts/{token}/{id}.json metadata. */
router.get('/:token/:id.json', (req, res) => {
  const { resolution } = req.query;
  const { id } = req.params;
  const nft = {
    issue: Nft.issue(id as NftFullId),
    level: Nft.level(id as NftFullId),
  };
  const level = NftLevel[nft.level].toUpperCase();
  const order = 1 + nft.level / 3; // 1, 2, 3, ...
  const token = capitalize(Token.XPOW.toLowerCase());
  res.send({
    name: `${level} ${Token.XPOW}`,
    description: `Stakeable ${level} ${Token.XPOW} NFT`,
    image: host(req) + join(
      '/ipfs/QmcMVdnJV6VaicjukafsTK1pX4Zthx6JbRvC9igLScrAjD/nfts',
      resolution as string ?? '320x427', `${nft.issue}`, token,
      `${order}-${token}_${level}.png`
    ),
  });
});
export default router;
