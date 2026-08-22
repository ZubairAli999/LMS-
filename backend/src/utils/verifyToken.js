const jwt = require('jsonwebtoken');

/**
 * Verify a JWT token.
 *
 * On success returns the decoded payload (contains the user `id`).
 * On failure returns an object of the shape { msg: "Invalid token" } so
 * the auth middlewares can branch on it.
 */
const verifyToken = (token) => {
    return jwt.verify(token, 'anykey', (err, decoded) => {
        if (err) {
            return { msg: 'Invalid token' };
        }
        return decoded;
    });
};

module.exports = verifyToken;
