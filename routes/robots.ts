import express from 'express';
const router = express.Router();

/** GET robots.txt file. */
router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('User-agent: *\nDisallow:');
});
export default router;
