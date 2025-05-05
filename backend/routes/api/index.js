const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots');
const spotImagesRouter = require('./spot-images.js');
const reviewsRouter = require('./reviews.js');
const reviewImagesRouter = require('./review-images');
const { restoreUser } = require("../../utils/auth");

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/spot-images', spotImagesRouter);
router.use('/spots', reviewsRouter);
router.use('/reviews', reviewsRouter);
router.use('/review-images', reviewImagesRouter);


router.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

module.exports = router;