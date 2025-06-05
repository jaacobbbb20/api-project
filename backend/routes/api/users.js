const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateSignup} = require('../../utils/validation');

const router = express.Router();

/* --------------------- */
/*        Routes         */
/* --------------------- */

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
    const { firstName, lastName, email, username, password } = req.body;
    
    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });

    if (existingUser) {
      return res.status(500).json({
        message: 'User already exists',
        errors: {
          email: 'User with that email already exists',
          username: 'User with that username already exists'
        }
      });
    }

    // If the user does not exist, first hash the password, then create a new user
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    // Prepare the data for the response
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    
    await setTokenCookie(res, safeUser);

    res.status(201).json({ user: safeUser });
  }
);

module.exports = router;