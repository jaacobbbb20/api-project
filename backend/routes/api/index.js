const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots');
const reviewsRouter = require('./reviews.js');
const { restoreUser } = require("../../utils/auth");

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/spots', reviewsRouter);
router.use('/reviews', reviewsRouter);

if (process.env.NODE_ENV !== 'production') {
  router.get("/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });
}

router.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

module.exports = router;