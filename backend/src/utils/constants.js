/**
 * Application-wide constant values.
 */

// HTTP status codes used across the application
const STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORISED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};

// User roles within the system
const ROLES = {
    admin: 'admin',
    teacher: 'teacher',
    student: 'student',
};

// Result status for a student sitting an exam
const RESULT_STATUS = {
    pass: 'Passed',
    fail: 'Failed',
};

module.exports = {
    STATUS,
    ROLES,
    RESULT_STATUS,
};
