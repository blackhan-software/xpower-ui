/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/no-var-requires: [off] */
import { capitalize, env_of } from './functions';
import express from 'express';
import env from '../env';

import { versionSource } from '../source/params/parsers';
import { versionTarget } from '../source/params/parsers';
export const router = express.Router();

/** GET migration page. */
router.get('/', (req, res) => {
  const params = new URLSearchParams(req.query as any);
  res.render('migrate/index.pig', {
    DESCRIPTION: 'Migrate old Tokens & NFTs to latest Version',
    TITLE: 'XPower: Migrate', ...env_of(req),
    VERSION_SRC: versionSource(params),
    VERSION_SRC_CAPITALIZED: capitalize(versionSource(params)),
    VERSION_TGT: versionTarget(params),
    VERSION_TGT_CAPITALIZED: capitalize(versionTarget(params)),
    ...env
  });
});
export default router;
