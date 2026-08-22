const Student = require('../model/Academic/Student');
const { STATUS, ROLES } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responesbodymsg');
const logger = require('../config/logger');

/**
 * Allow the request through only if the authenticated user is a student.
 */
const isStudent = async (req, res, next) => {
    const userId = req?.userAuth?._id;
    const studentFound = await Student.findById(userId);

    if (studentFound?.role === ROLES.student) {
        next();
    } else {
        logger.warn(`Access denied: user ${userId} is not a student`);
        errorResponseBody.err = 'Access Denied. User must be student';
        return res.status(STATUS.FORBIDDEN).json(errorResponseBody);
    }
};

module.exports = isStudent;
