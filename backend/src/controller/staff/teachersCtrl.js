const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const teacherService = require('../../service/staff/teacher-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Admin Register Teacher
 * @route       POST /api/teachers/admins/register
 * @access      Private
 */
exports.adminRegisterTeacher = async (req, res) => {
    try {
        logger.info(`Admin ${req.userAuth._id} registering teacher with data: ${JSON.stringify(req.body)}`);
        const response = await teacherService.registerTeacher({ ...req.body, userId: req.userAuth._id });
        successResponseBody.data = response;
        successResponseBody.message = 'Teacher registered Successfuly';
        logger.info(`Teacher registered successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error registering teacher: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Login a Teacher
 * @route       POST /api/teachers/login
 * @access      Public
 */
exports.loginTeacher = async (req, res) => {
    try {
        logger.info(`Teacher login attempt for email: ${req.body.email}`);
        const response = await teacherService.loginTeacher(req.body);
        if (!response) {
            successResponseBody.data = {};
            successResponseBody.message = 'Invalid login credentials';
            return res.status(STATUS.OK).json(successResponseBody);
        }
        successResponseBody.data = response.token;
        successResponseBody.message = 'Teacher logged in successfully';
        logger.info(`Teacher logged in successfully for email: ${req.body.email}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error logging in teacher: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Teachers
 * @route       GET /api/v1/admin/teachers
 * @access      Private admin only
 */
exports.getAllTeachersAdmin = async (req, res) => {
    try {
        logger.info('Fetching all teachers');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all teachers: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single a Teacher
 * @route       POST /api/teachers/:teacherID/admin
 * @access      Private admin only
 */
exports.getTeacherByAdmin = async (req, res) => {
    try {
        logger.info(`Fetching teacher with ID: ${req.params.teacherID}`);
        const response = await teacherService.getTeacherByAdmin(req.params.teacherID);
        successResponseBody.data = response;
        successResponseBody.message = 'Teacher fetched successfully';
        logger.info(`Teacher fetched successfully with ID: ${req.params.teacherID}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching teacher with ID ${req.params.teacherID}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error.message;
        errorResponseBody.message = 'Invalid teacher ID format';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
};

/**
 * @description Teacher Profile
 * @route       Get /api/teachers/profile
 * @access      Private Teacher only
 */
exports.getTeacherProfile = async (req, res) => {
    try {
        logger.info(`Fetching teacher profile for ID: ${req.userAuth?._id}`);
        const response = await teacherService.getTeacherProfile(req.userAuth?._id);
        successResponseBody.data = response;
        successResponseBody.message = 'Teacher profile fetched successfully';
        logger.info(`Teacher profile fetched successfully for ID: ${req.userAuth?._id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching teacher profile: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Teacher updating profile admin
 * @route       UPDATE /api/v1/teachers/:teacherID/update
 * @access      Private Teacher Only
 */
exports.teacherUpdateProfile = async (req, res) => {
    try {
        logger.info(`Updating teacher profile for ID: ${req.userAuth._id}, data: ${JSON.stringify(req.body)}`);
        const response = await teacherService.updateTeacherProfile(req.userAuth._id, req.body);
        successResponseBody.data = response;
        successResponseBody.message = 'Teacher profile updated successfully';
        logger.info(`Teacher profile updated successfully with ID: ${req.userAuth._id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating teacher profile: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin updating Teacher Profile
 * @route       UPDATE /api/v1/teachers/:teacherID/update/admin
 * @access      Private Admin Only
 */
exports.adminUpdateTeacher = async (req, res) => {
    try {
        logger.info(`Admin updating teacher with ID: ${req.params.teacherID}, data: ${JSON.stringify(req.body)}`);
        const response = await teacherService.adminUpdateTeacher(req.params.teacherID, req.body);
        successResponseBody.data = response.teacher;
        successResponseBody.message = response.message;
        logger.info(`Teacher updated by admin successfully with ID: ${req.params.teacherID}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating teacher by admin: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};
