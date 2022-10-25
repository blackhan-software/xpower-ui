/* eslint @typescript-eslint/no-var-requires: [off] */
import { env_of } from './functions';
import express from 'express';
import assert from 'assert';
import env from '../env';

export const router = express.Router();

/** GET migration page. */
router.get('/', (req, res) => {
  const { THOR_MOE_IMAGE_V5a } = env;
  assert(THOR_MOE_IMAGE_V5a, 'missing THOR_MOE_IMAGE_V5a');
  const { LOKI_MOE_IMAGE_V5a } = env;
  assert(LOKI_MOE_IMAGE_V5a, 'missing LOKI_MOE_IMAGE_V5a');
  const { ODIN_MOE_IMAGE_V5a } = env;
  assert(ODIN_MOE_IMAGE_V5a, 'missing ODIN_MOE_IMAGE_V5a');
  res.render('migrate/index.pig', {
    DESCRIPTION: 'Upgrade old XPower tokens to v5',
    TITLE: 'XPower: Migrate', ...env_of(req),
    THOR_MOE_IMAGE: THOR_MOE_IMAGE_V5a,
    LOKI_MOE_IMAGE: LOKI_MOE_IMAGE_V5a,
    ODIN_MOE_IMAGE: ODIN_MOE_IMAGE_V5a,
  });
});
export default router;
