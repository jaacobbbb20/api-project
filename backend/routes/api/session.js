const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// POST /api/users/login
// Log in
router.post('/', async (req, res) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, user);

    return res.json({ user: safeUser });
  }
);

// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

/* GET /api/session
      Gets the current user
      If a user is logged in, return the user's details
      If a user is not logged in, return null
      This route assumes that the `restoreUser` middleware in utils/auth.js is applied first.
          The middleware sets `req.user` based on the XSRF-Token
*/
router.get('/', (req, res) => {
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
    } 
    
  else return res.json({ user: null });
});

module.exports = router;