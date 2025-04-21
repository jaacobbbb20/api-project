const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

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