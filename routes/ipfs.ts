import env from '../env';
import express from 'express';
const router = express.Router();

/** GET ipfs page. */
router.get('/', (req, res) => {
    const url = new URL(req.originalUrl, env.IPFS_GATEWAY);
    res.redirect(url.toString());
});
export default router;
