const { STATUS } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responesbodymsg');
const logger = require('../config/logger');

/**
 * Global error handler. Any error passed to next(err) lands here and is
 * returned using the shared error response body.
 */
const globalErrHandler = (err, req, res, next) => {
    const statusCode = err.statusCode ? err.statusCode : STATUS.INTERNAL_SERVER_ERROR;
    logger.error(`Unhandled error on ${req.originalUrl}: ${err.message}`);

    errorResponseBody.err = err.message;
    errorResponseBody.message = err.message;
    return res.status(statusCode).json(errorResponseBody);
};

/**
 * Not found handler. Forwards a 404 error to the global error handler.
 */
const notFoundErr = (req, res, next) => {
    const err = new Error(`Cannot find ${req.originalUrl} on the server`);
    err.statusCode = STATUS.NOT_FOUND;
    next(err);
};

module.exports = { globalErrHandler, notFoundErr };
