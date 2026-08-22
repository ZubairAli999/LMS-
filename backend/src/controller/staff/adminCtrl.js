const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const adminService = require('../../service/staff/admin-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Register admins
 * @route       GET /api/v1/admins/register
 * @access      Private
 */
exports.registerAdminCtrl = async (req, res) => {
    try {
        logger.info(`Registering admin with data: ${JSON.stringify(req.body)}`);
        const response = await adminService.registerAdmin(req.body);
        successResponseBody.data = response;
        successResponseBody.message = 'Admin registered successfully. Glad you are here.';
        logger.info(`Admin registered successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error registering admin: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description login admins
 * @route       POST /api/v1/admins/login
 * @access      Private
 */
exports.loginAdminCtrl = async (req, res) => {
    try {
        logger.info(`Admin login attempt for email: ${req.body.email}`);
        const response = await adminService.loginAdmin(req.body);
        if (!response) {
            successResponseBody.data = {};
            successResponseBody.message = 'Invalid login credentials. Please try again.';
            return res.status(STATUS.OK).json(successResponseBody);
        }
        successResponseBody.data = response.token;
        successResponseBody.message = 'Admin logged in successfully.  Welcome back!';
        logger.info(`Admin logged in successfully for email: ${req.body.email}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error logging in admin: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get all admins
 * @route       GET /api/v1/admins
 * @access      Private
 */
exports.getAdminsCtrl = async (req, res) => {
    try {
        logger.info('Fetching all admins');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all admins: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Admin Profile
 * @route       GET /api/v1/admins/profile
 * @access      Private
 */
exports.getAdminProfileCtrl = async (req, res) => {
    try {
        logger.info(`Fetching admin profile for ID: ${req.userAuth._id}`);
        const response = await adminService.getAdminProfile(req.userAuth._id);
        successResponseBody.data = response;
        successResponseBody.message = 'Admin Profile fetched successfully';
        logger.info(`Admin profile fetched successfully for ID: ${req.userAuth._id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching admin profile: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Admin
 * @route       UPDATE /api/v1/admins/:id
 * @access      Private
 */
exports.updateAdminCtrl = async (req, res) => {
    try {
        logger.info(`Updating admin with ID: ${req.userAuth._id}, data: ${JSON.stringify(req.body)}`);
        const response = await adminService.updateAdmin(req.userAuth._id, req.body);
        successResponseBody.data = response;
        successResponseBody.message = 'Admin profile updated successfully';
        logger.info(`Admin profile updated successfully with ID: ${req.userAuth._id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating admin: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin suspends a teacher
 * @route       PUT /api/v1/admins/suspend/teacher:id
 * @access      Private
 */
exports.adminSuspendTeacherCtrl = async (req, res) => {
    try {
        successResponseBody.data = 'Admin has Suspended teacher successfully';
        successResponseBody.message = 'Successfully processed the request';
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error suspending teacher: ${error.err || error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin unsuspends a teacher
 * @route       PUT /api/v1/admins/unsuspend/teacher:id
 * @access      Private
 */
exports.adminUnsuspendteacherCtrl = async (req, res) => {
    try {
        successResponseBody.data = 'Admin has Unsuspended teacher successfully';
        successResponseBody.message = 'Successfully processed the request';
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error unsuspending teacher: ${error.err || error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin withdrawl a teacher
 * @route       PUT /api/v1/admins/withdraw/teacher:id
 * @access      Private
 */
exports.adminWithdrawTeacherCtrl = async (req, res) => {
    try {
        successResponseBody.data = 'Admin has withdrawn teacher successfully';
        successResponseBody.message = 'Successfully processed the request';
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error withdrawing teacher: ${error.err || error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin Unwithdrawl a teacher
 * @route       PUT /api/v1/admins/withdraw/teacher:id
 * @access      Private
 */
exports.adminUnwithdrawTeacherCtrl = async (req, res) => {
    try {
        successResponseBody.data = 'Admin has Unwithdrawn teacher successfully';
        successResponseBody.message = 'Successfully processed the request';
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error unwithdrawing teacher: ${error.err || error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin Publish Exam Results
 * @route       PUT /api/v1/admins/publish/exam:id
 * @access      Private
 */
exports.adminPublishResultsCtrl = async (req, res) => {
    try {
        successResponseBody.data = 'Admin has published exam result(s) successfully';
        successResponseBody.message = 'Successfully processed the request';
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error publishing exam results: ${error.err || error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin Unpublish Exam Results
 * @route       PUT /api/v1/admins/unpublish/exam:id
 * @access      Private
 */
exports.adminUnpublishResultsCtrl = async (req, res) => {
    try {
        successResponseBody.data = 'Admin has Unpublished exam result(s) successfully';
        successResponseBody.message = 'Successfully processed the request';
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error unpublishing exam results: ${error.err || error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};
