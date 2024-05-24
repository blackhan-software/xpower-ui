/* eslint @typescript-eslint/no-explicit-any: [off] */
import { nftLevels } from '../../../source/params/parsers';
import { Nft, NftLevels } from '../../../source/redux/types';
import { Request } from 'express';

export const env_of_nfts = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  return {
    ...nft_chevron(params),
    ...nft_display(params),
  };
};
const nft_display = (
  params: URLSearchParams
) => {
  const url_levels = nftLevels(params);
  const all_levels = Array.from(NftLevels({ min: 0, max: Infinity }));
  return Object.fromEntries(all_levels.map((l) => [
    `NFT_${Nft.nameOf(l)}_DISPLAY`, url_levels.includes(l) ? 'block' : 'none'
  ]));
};
const nft_chevron = (
  params: URLSearchParams
) => {
  const url_levels = nftLevels(params);
  const all_levels = Array.from(NftLevels({ min: 0, max: Infinity }));
  return Object.fromEntries(all_levels.map((l) => [
    `NFT_${Nft.nameOf(l)}_CHEVRON`, url_levels.includes(l) ? 'up' : 'down'
  ]));
};
export default env_of_nfts;
