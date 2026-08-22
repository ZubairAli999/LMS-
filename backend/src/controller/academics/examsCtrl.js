const { successResponseBody, errorResponseBody } = require('../../utils/responesbodymsg');
const examService = require('../../service/academics/exam-service');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

/**
 * @description Create Exam
 * @route       POST /api/v1/exams
 * @access      Private Teachers Only
 */
const createExam = async (req, res) => {
    try {
        const userId = req.userAuth._id;
        logger.info(`Creating exam for teacher ID: ${userId}, data: ${JSON.stringify(req.body)}`);
        const response = await examService.createExam({ ...req.body, userId: userId });
        successResponseBody.message = 'Exam created successfully';
        successResponseBody.data = response;
        logger.info(`Exam created successfully with ID: ${response._id}`);
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        logger.error(`Error creating exam: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get All Exams
 * @route       GET /api/v1/exams
 * @access      Private
 */
const getExams = async (req, res) => {
    try {
        logger.info('Fetching all exams');
        return res.status(STATUS.OK).json(res.results);
    } catch (error) {
        logger.error(`Error fetching all exams: ${error.message}`);
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Get Single Exam
 * @route       GET /api/v1/exams/:id
 * @access      Private Teachers Only
 */
const getExam = async (req, res) => {
    try {
        logger.info(`Fetching exam with ID: ${req.params.id}`);
        const response = await examService.getExam(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Exam fetched successfully';
        logger.info(`Exam fetched successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error fetching exam with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Update Exam
 * @route       PUT /api/admins/exams/:id
 * @access      Private Teacher Only
 */
const updateExam = async (req, res) => {
    try {
        logger.info(`Updating exam with ID: ${req.params.id}, data: ${JSON.stringify(req.body)}`);
        const response = await examService.updateExam(req.params.id, {
            ...req.body,
            userId: req.userAuth._id,
        });
        successResponseBody.data = response;
        successResponseBody.message = 'Exam updated successfully';
        logger.info(`Exam updated successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error updating exam with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

/**
 * @description Delete Exam
 * @route       DELETE /api/admins/exams/:id
 * @access      Private Teachers
 */
const deleteExam = async (req, res) => {
    try {
        logger.info(`Deleting exam with ID: ${req.params.id}`);
        await examService.deleteExam(req.params.id);
        successResponseBody.data = {};
        successResponseBody.message = 'Exam Deleted Successfully';
        logger.info(`Exam deleted successfully with ID: ${req.params.id}`);
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        logger.error(`Error deleting exam with ID ${req.params.id}: ${error.err || error.message}`);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createExam,
    getExams,
    getExam,
    updateExam,
    deleteExam,
};
