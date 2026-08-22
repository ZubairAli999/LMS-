const jwt = require("jsonwebtoken");

/**
 *  Generate a token for a user using jsonwebtoken
 */
const generateToken = (id) => {
    return jwt.sign({id}, 'anykey', {expiresIn: '5d'});
};

module.exports = generateToken