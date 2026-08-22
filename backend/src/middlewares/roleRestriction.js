const { STATUS } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responesbodymsg');
const logger = require('../config/logger');

/**
 * @description Restrict a route to the given roles. Responds with a forbidden
 *              error if req.userAuth.role is not among the allowed roles.
 * @param  {...any} roles - allowed roles for the route
 */
const roleRestriction = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userAuth?.role)) {
            logger.warn(`Role restriction hit: role '${req.userAuth?.role}' not in [${roles.join(', ')}]`);
            errorResponseBody.err = 'You do not have permission to perform this action';
            return res.status(STATUS.FORBIDDEN).json(errorResponseBody);
        }
        next();
    };
};

module.exports = roleRestriction;
