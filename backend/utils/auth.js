const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// setTokenCookie START
    
    // Sends a JWT (JSON Web Token) Cookie

const setTokenCookie = (res, user) => {
    // Creates the token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,000 seconds = One Week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Sets the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge converted into milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });
    return token;
}

// setTokenCookie END

//restoreUser START

    // This function restores the session's user based on what the JWT cookie is.
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
          } catch (e) {
            res.clearCookie('token');
            return next();
          }

          if (!req.user) res.clearCookie('token');

          return next();
    });
};
//restoreUser END

// requireAuth START

    // This function is a requirement that authenticates the user before a route is accessed

// No current user? RETURN AN ERROR
const requireAuth = function (req, _res, next) {
    if (req.user) return next ();

    const err = new Error('Authentication is required');
    err.title = 'Authentication is required';
    err.errors = { message: 'Authentication is required'};
    err.status = 401;
    return next(err);
}

module.exports = { setTokenCookie, restoreUser, requireAuth };

// restoreUser END