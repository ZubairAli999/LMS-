const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const studentService = require('../../service/students/student-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Admin Register Student
 * @route       POST /api/students/admins/register
 * @access      Private Admin Only
 */
const adminRegisterStudent = async (req, res) => {
    try {
        logger.info(`Admin ${req.userAuth._id} registering student, data: ${JSON.stringify(req.body)}`);
        const response = await studentService.adminRegisterStudent(req.userAuth._id, req.body);
        successResponseBody.message = 'Student registered Successfuly';
        successResponseBody.data = response;
        logger.info(`Student registered successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error registering student: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Login a Student
 * @route       POST /api/students/login
 * @access      Public
 */
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        logger.info(`Student login attempt for email: ${email}`);
        const response = await studentService.loginStudent(email, password);
        successResponseBody.message = 'Student logged in successfully';
        successResponseBody.data = response;
        logger.info(`Student logged in successfully for email: ${email}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error logging in student: ${error.err || error.message}`);
        if (error.err) {
            return res.json({ message: error.err });
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Student Profile
 * @route       Get /api/students/profile
 * @access      Private Student only
 */
const getStudentProfile = async (req, res) => {
    try {
        logger.info(`Fetching student profile for ID: ${req.userAuth?._id}`);
        const response = await studentService.getStudentProfile(req.userAuth?._id);
        successResponseBody.data = response;
        successResponseBody.message = 'Student profile fetched successfully';
        logger.info(`Student profile fetched successfully for ID: ${req.userAuth?._id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching student profile: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Students
 * @route       GET /api/v1/students/admin
 * @access      Private admin only
 */
const getAllStudentsByAdmin = async (req, res) => {
    try {
        logger.info('Fetching all students by admin');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all students: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single a Student
 * @route       POST /api/v1/students/:studentID/admin
 * @access      Private admin only
 */
const getStudentByAdmin = async (req, res) => {
    try {
        logger.info(`Fetching student by admin with ID: ${req.params.studentID}`);
        const response = await studentService.getStudentByAdmin(req.params.studentID);
        successResponseBody.data = response;
        successResponseBody.message = 'Student fetched successfully';
        logger.info(`Student fetched successfully with ID: ${req.params.studentID}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching student by admin with ID ${req.params.studentID}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Student updating profile
 * @route       UPDATE /api/v1/students/update
 * @access      Private Student Only
 */
const studentUpdateProfile = async (req, res) => {
    try {
        logger.info(`Student ${req.userAuth._id} updating profile, data: ${JSON.stringify(req.body)}`);
        const response = await studentService.studentUpdateProfile(req.userAuth._id, req.body);
        successResponseBody.data = response;
        successResponseBody.message = 'Student profile updated successfully';
        logger.info(`Student profile updated successfully with ID: ${req.userAuth._id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating student profile with ID ${req.userAuth._id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Admin Update Student eg: Assign Classes, name, etc.
 * @route       UPDATE /api/v1/students/:studentID/update/admin
 * @access      Private Admin Only
 *
 * Notes:  $set operator replaces the value of a field with the specified value - mongoose handles saving those field. see docs: https://www.mongodb.com/docs/manual/reference/operator/update/set/
 * Notes:  $addToSet operator adds a value to an array UNLESS the value is already present. see docs: https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
 */
const adminUpdateStudent = async (req, res) => {
    try {
        logger.info(`Admin updating student with ID: ${req.params.studentID}, data: ${JSON.stringify(req.body)}`);
        const response = await studentService.adminUpdateStudent(req.params.studentID, req.body);
        successResponseBody.data = response;
        successResponseBody.message = 'Student updated successfully';
        logger.info(`Student updated successfully with ID: ${req.params.studentID}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating student by admin with ID ${req.params.studentID}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Student taking exam
 * @route       POST /api/v1/students/exams/:examID/write
 * @access      Private Student Only
 */
const writeExam = async (req, res) => {
    try {
        logger.info(`Student ${req.userAuth?.id} writing exam ${req.params.examID}`);
        const response = await studentService.writeExam(req.userAuth?.id, req.params.examID, req.body?.answers);
        successResponseBody.data = response;
        successResponseBody.message = 'Successfully processed the request';
        logger.info(`Student ${req.userAuth?.id} submitted exam ${req.params.examID} successfully`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error writing exam ${req.params.examID}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    adminRegisterStudent,
    loginStudent,
    getStudentProfile,
    getAllStudentsByAdmin,
    getStudentByAdmin,
    studentUpdateProfile,
    adminUpdateStudent,
    writeExam,
};
