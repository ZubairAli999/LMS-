const Teacher = require('../model/Staff/Teacher');
const { STATUS, ROLES } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responesbodymsg');
const logger = require('../config/logger');

/**
 * Allow the request through only if the authenticated user is a teacher.
 */
const isTeacher = async (req, res, next) => {
    const userId = req?.userAuth?._id;
    const teacherFound = await Teacher.findById(userId);

    if (teacherFound?.role === ROLES.teacher) {
        next();
    } else {
        logger.warn(`Access denied: user ${userId} is not a teacher`);
        errorResponseBody.err = 'Access Denied. User must be teacher';
        return res.status(STATUS.FORBIDDEN).json(errorResponseBody);
    }
};

module.exports = isTeacher;
