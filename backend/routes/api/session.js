const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

/* --------------------- */
/*      Validators       */
/* --------------------- */

const validateLogin = [
   check('credential')
      .exists({ checkFalsy: true })
     .withMessage('Please provide a valid email or username.'),
   check('password')
     .exists({ checkFalsy: true })
     .withMessage('Please provide a password.'),
   handleValidationErrors
];

/* --------------------- */
/*        Routes         */
/* --------------------- */

/* GET /api/session - Get the current user */
router.get("/", (req, res) => {
  const { user } = req;

  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    return res.json({ user: safeUser });
  } else return res.json({ user: null });
});

/* POST /api/session - Log the user in */
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The provided credentials were invalid." };
    return next(err);
  }

  const safeUser = {
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
    username: user.username
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

/* DELETE /api/session - Log out the user */
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

module.exports = router;
