const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots');
const reviewsRouter = require('./reviews.js');
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);

router.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// REMOVE BEFORE PRODUCTION
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;