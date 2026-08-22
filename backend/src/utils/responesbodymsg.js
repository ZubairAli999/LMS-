/**
 * Shared response body objects used by controllers to keep the
 * response shape consistent across the whole application.
 */

const successResponseBody = {
    err: {},
    data: {},
    message: 'Successfully processed the request',
    success: true,
};

const errorResponseBody = {
    err: {},
    data: {},
    message: 'Something went wrong, could not process the request',
    success: false,
};

const BadRequestResponse = {
    err: {},
    data: {},
    message: 'Invalid request, please check the request and try again',
    success: false,
};

module.exports = {
    successResponseBody,
    errorResponseBody,
    BadRequestResponse,
};
