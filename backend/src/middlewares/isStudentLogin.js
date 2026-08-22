const Student = require('../model/Academic/Student');
const verifyToken = require('../utils/verifyToken');
const { STATUS } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responesbodymsg');
const logger = require('../config/logger');

/**
 * Verify the request bearer token for a Student and attach the user to req.userAuth.
 */
const isStudentLogin = async (req, res, next) => {
    try {
        const headerObj = req.headers;
        const token = headerObj?.authorization?.split(' ')[1]; // using optional chaining

        const verifiedToken = verifyToken(token);
        if (verifiedToken.msg === 'Invalid token') {
            logger.warn('Student login check failed: token expired/invalid');
            errorResponseBody.err = 'Token expired/invalid';
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }

        const user = await Student.findById(verifiedToken.id).select('name email role');
        req.userAuth = user;
        next();
    } catch (error) {
        logger.error(`Error during student login check: ${error.message}`);
        errorResponseBody.err = error.message;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = isStudentLogin;
