import express from 'express';
export const router = express.Router();

/** GET about page. */
router.get('/', (req, res) => {
  res.render('about/about.pug');
});
export default router;
