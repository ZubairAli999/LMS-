const Admin = require('../model/Staff/Admin');
const { STATUS, ROLES } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responesbodymsg');
const logger = require('../config/logger');

/**
 * Allow the request through only if the authenticated user is an admin.
 */
const isAdmin = async (req, res, next) => {
    const userId = req?.userAuth?._id;
    const adminFound = await Admin.findById(userId);

    if (adminFound?.role === ROLES.admin) {
        next();
    } else {
        logger.warn(`Access denied: user ${userId} is not an admin`);
        errorResponseBody.err = 'Access Denied. User must be admin';
        return res.status(STATUS.FORBIDDEN).json(errorResponseBody);
    }
};

module.exports = isAdmin;
